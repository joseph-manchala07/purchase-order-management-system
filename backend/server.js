const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../.env"),
  override: true
});

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const poRoutes = require("./routes/poRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const approverRoutes = require("./routes/approverRoutes");

const app = express();

app.use((req, res, next) => {
  const requestPath = req.originalUrl || req.url;
  console.log("REQUEST HIT:", req.method, requestPath);
  next();
});

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "working" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/debug", (_req, res) => {
  res.json({ status: "running" });
});

app.get("/api/test", (_req, res) => {
  res.json({ message: "API test successful" });
});

const routeUnderTest = process.env.ROUTE_UNDER_TEST || "all";

if (routeUnderTest === "auth") {
  app.use("/api/auth", authRoutes);
} else if (routeUnderTest === "vendors") {
  app.use("/api/vendors", vendorRoutes);
} else if (routeUnderTest === "po") {
  app.use("/api/po", poRoutes);
} else if (routeUnderTest === "employees") {
  app.use("/api/employees", employeeRoutes);
} else if (routeUnderTest === "approvers") {
  app.use("/api/approvers", approverRoutes);
} else if (routeUnderTest === "all") {
  app.use("/api/auth", authRoutes);
  app.use("/api/vendors", vendorRoutes);
  app.use("/api/po", poRoutes);
  app.use("/api/employees", employeeRoutes);
  app.use("/api/approvers", approverRoutes);
} else {
  console.warn("[DEBUG] No API routes mounted (ROUTE_UNDER_TEST=none).");
}

console.log(`[DEBUG] ROUTE_UNDER_TEST=${routeUnderTest}`);

const PORT = Number(process.env.PORT) || 3001;
const db = require("./config/db");

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
});

const runStartupMaintenance = async () => {
  try {
    const schemaName = process.env.DB_NAME || "PurchaseOrderManagement";

    console.log("[STARTUP] STEP 1: DB ping query (SELECT 1) starting");
    await db.query("SELECT 1");
    console.log("[STARTUP] STEP 1 COMPLETE: DB ping query finished");

    console.log("[STARTUP] STEP 2: Check Employees.PasswordMustChange column starting");
    const [columns] = await db.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'Employees' AND COLUMN_NAME = 'PasswordMustChange'`,
      [schemaName]
    );
    console.log("[STARTUP] STEP 2 COMPLETE: Employees column check finished");

    if (columns.length === 0) {
      console.log("[STARTUP] STEP 3: Add Employees.PasswordMustChange column starting");
      await db.query(
        "ALTER TABLE Employees ADD COLUMN PasswordMustChange TINYINT(1) NOT NULL DEFAULT 0"
      );
      console.log("[STARTUP] STEP 3 COMPLETE: Employees column added");
    } else {
      console.log("[STARTUP] STEP 3 SKIPPED: Employees.PasswordMustChange already exists");
    }

    console.log("[STARTUP] STEP 4: Check PurchaseOrders.PO_Number default starting");
    const [poNumberColumn] = await db.query(
      `SELECT COLUMN_DEFAULT
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'PurchaseOrders' AND COLUMN_NAME = 'PO_Number'`,
      [schemaName]
    );
    console.log("[STARTUP] STEP 4 COMPLETE: PO_Number default check finished");

    if (poNumberColumn.length > 0 && poNumberColumn[0].COLUMN_DEFAULT === null) {
      try {
        console.log("[STARTUP] STEP 5: Set PO_Number default to 0 starting");
        await db.query(
          "ALTER TABLE PurchaseOrders ALTER COLUMN PO_Number SET DEFAULT 0"
        );
        console.log("[STARTUP] STEP 5 COMPLETE: PO_Number default set");
      } catch (schemaError) {
        console.warn(
          "[STARTUP] STEP 5 FAILED: Unable to set default for PurchaseOrders.PO_Number:",
          schemaError.message || schemaError
        );
      }
    } else {
      console.log("[STARTUP] STEP 5 SKIPPED: PO_Number default already configured");
    }

    try {
      console.log("[STARTUP] STEP 6: Calculate next PurchaseOrders AUTO_INCREMENT starting");
      const [nextPoRows] = await db.query(
        `SELECT GREATEST(
            IFNULL(MAX(PO_ID), 0),
            IFNULL(MAX(CAST(PO_Number AS UNSIGNED)), 0)
         ) + 1 AS NextAutoIncrement
         FROM PurchaseOrders`
      );
      console.log("[STARTUP] STEP 6 COMPLETE: AUTO_INCREMENT value calculated");

      const nextAutoIncrement = Number(nextPoRows[0]?.NextAutoIncrement || 1);

      if (Number.isFinite(nextAutoIncrement) && nextAutoIncrement > 0) {
        console.log("[STARTUP] STEP 7: Align PurchaseOrders AUTO_INCREMENT starting");
        await db.query(
          `ALTER TABLE PurchaseOrders AUTO_INCREMENT = ${nextAutoIncrement}`
        );
        console.log("[STARTUP] STEP 7 COMPLETE: AUTO_INCREMENT aligned");
      } else {
        console.log("[STARTUP] STEP 7 SKIPPED: Calculated AUTO_INCREMENT value is invalid");
      }
    } catch (schemaError) {
      console.warn(
        "[STARTUP] STEP 6/7 FAILED: Unable to align PurchaseOrders AUTO_INCREMENT:",
        schemaError.message || schemaError
      );
    }
  } catch (err) {
    console.error("[STARTUP] Database maintenance failed:", err.message || err);
    console.error("[STARTUP] Server remains running, but DB-dependent endpoints may fail until DB is reachable.");
  }
};

runStartupMaintenance();
