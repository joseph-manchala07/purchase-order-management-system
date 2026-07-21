const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../.env")
});

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Purchase Order Management API is running"
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/vendors", require("./routes/vendorRoutes"));
app.use("/api/po", require("./routes/poRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/approvers", require("./routes/approverRoutes"));
// Users table removed in new design; user routes deprecated.

const PORT = process.env.PORT || 3000;

// Simple startup DB check to surfacing DB connectivity or schema issues early.
const db = require("./config/db");

(async () => {
  try {
    // quick ping
    await db.query("SELECT 1");

    const [columns] = await db.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'Employees' AND COLUMN_NAME = 'PasswordMustChange'`,
      [process.env.DB_NAME || 'PurchaseOrderManagement']
    );

    if (columns.length === 0) {
      await db.query(
        "ALTER TABLE Employees ADD COLUMN PasswordMustChange TINYINT(1) NOT NULL DEFAULT 0"
      );
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection/health check failed:", err.message || err);
    console.error("This likely explains 500 responses from endpoints that query the DB.\nPlease verify your DB connection settings and ensure the Employees table exists.");
    process.exit(1);
  }
})();
