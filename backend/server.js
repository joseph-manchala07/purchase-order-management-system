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

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on 0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("Database connection/health check failed:", err.message || err);
    console.error("This likely explains 500 responses from endpoints that query the DB.\nPlease verify your DB connection settings and ensure the Employees table exists.");
    process.exit(1);
  }
})();
