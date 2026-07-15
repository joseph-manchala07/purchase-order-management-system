const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const DEFAULT_PASSWORD = process.env.DEFAULT_USER_PASSWORD || "DefaultPass123!";

const isDefaultPasswordHash = async (hash) => {
  return await bcrypt.compare(DEFAULT_PASSWORD, hash);
};

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
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, employee.PasswordHash);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const forcePasswordChange =
      Number(employee.PasswordMustChange) === 1 ||
      (await isDefaultPasswordHash(employee.PasswordHash));

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