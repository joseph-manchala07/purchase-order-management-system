const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../.env")
});

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const poRoutes = require("./routes/poRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const approverRoutes = require("./routes/approverRoutes");

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Purchase Order Management API is running"
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/test", (_req, res) => {
  res.json({
    message: "API test successful"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/po", poRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/approvers", approverRoutes);

const PORT = Number(process.env.PORT) || 3001;

const db = require("./config/db");

(async () => {
  try {
    await db.query("SELECT 1");

    const [columns] = await db.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'Employees' AND COLUMN_NAME = 'PasswordMustChange'`,
      [process.env.DB_NAME || "PurchaseOrderManagement"]
    );

    if (columns.length === 0) {
      await db.query(
        "ALTER TABLE Employees ADD COLUMN PasswordMustChange TINYINT(1) NOT NULL DEFAULT 0"
      );
    }

    const [poNumberColumn] = await db.query(
      `SELECT COLUMN_DEFAULT
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'PurchaseOrders' AND COLUMN_NAME = 'PO_Number'`,
      [process.env.DB_NAME || "PurchaseOrderManagement"]
    );

    if (poNumberColumn.length > 0 && poNumberColumn[0].COLUMN_DEFAULT === null) {
      try {
        await db.query(
          "ALTER TABLE PurchaseOrders ALTER COLUMN PO_Number SET DEFAULT 0"
        );
      } catch (schemaError) {
        console.warn(
          "Unable to set default for PurchaseOrders.PO_Number:",
          schemaError.message || schemaError
        );
      }
    }

    try {
      const [nextPoRows] = await db.query(
        `SELECT GREATEST(
            IFNULL(MAX(PO_ID), 0),
            IFNULL(MAX(CAST(PO_Number AS UNSIGNED)), 0)
         ) + 1 AS NextAutoIncrement
         FROM PurchaseOrders`
      );

      const nextAutoIncrement = Number(nextPoRows[0]?.NextAutoIncrement || 1);

      if (Number.isFinite(nextAutoIncrement) && nextAutoIncrement > 0) {
        await db.query(
          `ALTER TABLE PurchaseOrders AUTO_INCREMENT = ${nextAutoIncrement}`
        );
      }
    } catch (schemaError) {
      console.warn(
        "Unable to align PurchaseOrders AUTO_INCREMENT:",
        schemaError.message || schemaError
      );
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on 0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("Database connection/health check failed:", err.message || err);
    console.error("This likely explains 500 responses from endpoints that query the DB.\nPlease verify your DB connection settings and ensure the Employees table exists.");
    process.exit(1);
  }
})();
