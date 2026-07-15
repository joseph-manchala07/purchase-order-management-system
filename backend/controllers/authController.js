const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      `SELECT EmployeeID, FirstName, LastName, Email, IsApprover, IsAdministrator, PasswordHash,
              IFNULL(PasswordMustChange, 0) AS PasswordMustChange
       FROM Employees
       WHERE (
           Email = ?
           OR CONCAT_WS(' ', FirstName, LastName) = ?
           OR CONCAT_WS('.', FirstName, LastName) = ?
         )`,
      [email, email, email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const employee = rows[0];

    if (!employee.PasswordHash) {
      return res.status(401).json({ message: "Account not activated. Please use the First Time User setup to set your password." });
    }

    const validPassword = await bcrypt.compare(password, employee.PasswordHash);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const forcePasswordChange = Number(employee.PasswordMustChange) === 1;

    const isApprover = Number(employee.IsApprover) === 1;
    const isAdministrator = Number(employee.IsAdministrator) === 1;

    let role = "Employee";

    if (isAdministrator) {
      role = "Administrator";
    } else if (isApprover) {
      role = "Approver";
    }

    const token = jwt.sign(
      {
        EmployeeID: employee.EmployeeID,
        Email: employee.Email,
        Role: role
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      token,
      role,
      forcePasswordChange,
      user: {
        EmployeeID: employee.EmployeeID,
        Name: `${employee.FirstName} ${employee.LastName}`.trim(),
        Email: employee.Email,
        Role: role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.checkApprover = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: "First name and last name are required." });
    }

    const [rows] = await db.query(
      `SELECT EmployeeID, IsApprover, IsAdministrator, PasswordHash,
              IFNULL(PasswordMustChange, 0) AS PasswordMustChange
       FROM Employees
       WHERE LOWER(FirstName) = LOWER(?) AND LOWER(LastName) = LOWER(?)`,
      [firstName.trim(), lastName.trim()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No account found with that name." });
    }

    const employee = rows[0];

    if (Number(employee.IsApprover) !== 1 && Number(employee.IsAdministrator) !== 1) {
      return res.status(403).json({ message: "Not an approver" });
    }

    const isFirstTime = Number(employee.PasswordMustChange) === 1 || !employee.PasswordHash;

    if (!isFirstTime) {
      return res.status(403).json({ message: "This account does not require a first-time password setup." });
    }

    res.json({ message: "Approver verified.", employeeId: employee.EmployeeID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.firstTimeSetup = async (req, res) => {
  try {
    const { firstName, lastName, newPassword, confirmPassword } = req.body;

    if (!firstName || !lastName || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const [rows] = await db.query(
      `SELECT EmployeeID, IsApprover, IsAdministrator, PasswordHash,
              IFNULL(PasswordMustChange, 0) AS PasswordMustChange
       FROM Employees
       WHERE LOWER(FirstName) = LOWER(?) AND LOWER(LastName) = LOWER(?)`,
      [firstName.trim(), lastName.trim()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No account found with that name." });
    }

    const employee = rows[0];

    if (Number(employee.IsApprover) !== 1 && Number(employee.IsAdministrator) !== 1) {
      return res.status(403).json({ message: "Not an approver" });
    }

    const isFirstTime = Number(employee.PasswordMustChange) === 1 || !employee.PasswordHash;

    if (!isFirstTime) {
      return res.status(403).json({ message: "This account does not require a first-time password setup." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.query(
      `UPDATE Employees SET PasswordHash = ?, PasswordMustChange = 0 WHERE EmployeeID = ?`,
      [passwordHash, employee.EmployeeID]
    );

    res.json({ message: "Password set successfully. You can now log in." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};