const db = require("../config/db");
const bcrypt = require("bcryptjs");

const getDefaultEmail = (firstName, lastName) => {
  const fn = (firstName || "").trim();
  const ln = (lastName || "").trim();
  if (!fn && !ln) return null;
  return `${fn || ln}.${ln || fn}`.toLowerCase();
};

const parseEmployeeName = (employeeName, firstName, lastName) => {
  const fn = (firstName || "").trim();
  const ln = (lastName || "").trim();

  if (fn || ln) {
    return {
      FirstName: fn,
      LastName: ln || fn
    };
  }

  const nameParts = (employeeName || "").trim().split(" ").filter(Boolean);
  return {
    FirstName: nameParts.shift() || "",
    LastName: nameParts.join(" ") || ""
  };
};

const findEmployeeByFirstLastName = async (firstName, lastName) => {
  const [rows] = await db.query(
    `SELECT EmployeeID, IsApprover, IsAdministrator
     FROM Employees
     WHERE LOWER(TRIM(FirstName)) = LOWER(TRIM(?))
       AND LOWER(TRIM(LastName)) = LOWER(TRIM(?))
     LIMIT 1`,
    [firstName, lastName]
  );

  return rows[0] || null;
};

const insertEmployeeWithNextId = async (
  connection,
  {
    firstName,
    lastName,
    title,
    email,
    isApprover,
    isAdministrator,
    passwordHash,
    passwordMustChange
  }
) => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const [nextIdRows] = await connection.query(
      `SELECT COALESCE(MAX(EmployeeID), 0) + 1 AS NextEmployeeID FROM Employees`
    );

    const nextEmployeeId = Number(nextIdRows[0]?.NextEmployeeID || 1);

    try {
      await connection.query(
        `
        INSERT INTO Employees
        (
          EmployeeID,
          FirstName,
          LastName,
          Title,
          Email,
          IsApprover,
          IsAdministrator,
          PasswordHash,
          PasswordMustChange,
          CreatedDate
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `,
        [
          nextEmployeeId,
          firstName,
          lastName,
          title,
          email,
          isApprover,
          isAdministrator,
          passwordHash,
          passwordMustChange
        ]
      );

      return nextEmployeeId;
    } catch (error) {
      if (!(error && error.code === "ER_DUP_ENTRY")) {
        throw error;
      }
    }
  }

  throw new Error("Unable to assign EmployeeID. Please try again.");
};

// Get employees.
// Optional query: ?isApprover=1 or ?isAdministrator=1
exports.getEmployees = async (req, res) => {
  try {
    const isApprover = req.query.isApprover;
    const isAdministrator = req.query.isAdministrator;

    let sql = `
            SELECT
                EmployeeID,
                FirstName,
                LastName,
                CONCAT_WS(' ', FirstName, LastName) AS EmployeeName,
                COALESCE(NULLIF(Email, ''), CONCAT_WS('.', FirstName, LastName)) AS Username,
                Title,
                Email,
                IsApprover,
                IsAdministrator,
                CreatedDate
            FROM Employees
        `;

    const params = [];

    if (isApprover === "1") {
      sql += " WHERE IsApprover = 1";
    } else if (isAdministrator === "1") {
      sql += " WHERE IsAdministrator = 1";
    }

    sql += " ORDER BY FirstName, LastName";

    const [rows] = await db.query(sql, params);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  let connection;

  try {
    const { EmployeeName, FirstName, LastName, Title, Email, IsApprover = 0, IsAdministrator = 0, Password } = req.body;
    const name = parseEmployeeName(EmployeeName, FirstName, LastName);

    if (!name.FirstName || !name.LastName) {
      return res.status(400).json({ message: "First name and last name are required." });
    }

    const existingEmployee = await findEmployeeByFirstLastName(name.FirstName, name.LastName);

    if (existingEmployee) {
      return res.status(409).json({
        message: "Employee already exists.",
        employeeId: existingEmployee.EmployeeID
      });
    }

    const isAdministratorInt = IsAdministrator == 1 ? 1 : 0;
    const isApproverInt = isAdministratorInt === 1 ? 1 : (IsApprover == 1 ? 1 : 0);

    let passwordHash = null;
    const normalizedEmail = Email ? Email.trim() : null;
    const userEmail = normalizedEmail || (isApproverInt === 1 ? getDefaultEmail(name.FirstName, name.LastName) : null);

    if (Password) {
      passwordHash = await bcrypt.hash(Password, 10);
    }

    const passwordMustChange = isApproverInt === 1 && !Password ? 1 : 0;

    connection = await db.getConnection();

    await insertEmployeeWithNextId(
      connection,
      {
        firstName: name.FirstName,
        lastName: name.LastName,
        title: Title || null,
        email: userEmail,
        isApprover: isApproverInt,
        isAdministrator: isAdministratorInt,
        passwordHash,
        passwordMustChange
      }
    );

    res.json({ message: "Employee added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.createOrEnableApprover = async (req, res) => {
  let connection;

  try {
    const { EmployeeName, FirstName, LastName, Title, Email } = req.body;
    const name = parseEmployeeName(EmployeeName, FirstName, LastName);

    if (!name.FirstName || !name.LastName) {
      return res.status(400).json({ message: "First name and last name are required." });
    }

    const existingEmployee = await findEmployeeByFirstLastName(name.FirstName, name.LastName);

    if (existingEmployee) {
      if (Number(existingEmployee.IsApprover) !== 1) {
        await db.query(
          `UPDATE Employees
           SET IsApprover = 1
           WHERE EmployeeID = ?`,
          [existingEmployee.EmployeeID]
        );
      }

      return res.json({
        message: "Employee already exists. Approver permissions have been enabled.",
        employeeId: existingEmployee.EmployeeID,
        alreadyExisted: true
      });
    }

    const normalizedEmail = Email ? Email.trim() : null;
    const userEmail = normalizedEmail || getDefaultEmail(name.FirstName, name.LastName);

    connection = await db.getConnection();

    const createdEmployeeId = await insertEmployeeWithNextId(
      connection,
      {
        firstName: name.FirstName,
        lastName: name.LastName,
        title: Title || null,
        email: userEmail,
        isApprover: 1,
        isAdministrator: 0,
        passwordHash: null,
        passwordMustChange: 1
      }
    );

    return res.status(201).json({
      message: "Approver added",
      employeeId: createdEmployeeId,
      alreadyExisted: false
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
            SELECT
                EmployeeID,
                FirstName,
                LastName,
                CONCAT_WS(' ', FirstName, LastName) AS EmployeeName,
                COALESCE(NULLIF(Email, ''), CONCAT_WS('.', FirstName, LastName)) AS Username,
                Title,
                Email,
                IsApprover,
                IsAdministrator,
                CreatedDate
            FROM Employees
            WHERE EmployeeID = ?
            `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { EmployeeName, FirstName, LastName, Title, Email, IsApprover, IsAdministrator, Password } = req.body;
    const name = parseEmployeeName(EmployeeName, FirstName, LastName);

    // fetch existing role flags and password-change state
    const [existingRows] = await db.query(
      `SELECT IsApprover, IsAdministrator, IFNULL(PasswordMustChange, 0) AS PasswordMustChange
       FROM Employees
       WHERE EmployeeID = ?`,
      [id]
    );
    const existingIsApprover = existingRows && existingRows[0] ? (existingRows[0].IsApprover ? 1 : 0) : 0;
    const existingIsAdministrator = existingRows && existingRows[0] ? (existingRows[0].IsAdministrator ? 1 : 0) : 0;
    const existingPasswordMustChange = existingRows && existingRows[0] ? (existingRows[0].PasswordMustChange ? 1 : 0) : 0;

    let passwordHash = undefined;
    if (Password) {
      passwordHash = await bcrypt.hash(Password, 10);
    }

    const newIsAdministrator = IsAdministrator !== undefined
      ? (IsAdministrator ? 1 : 0)
      : existingIsAdministrator;

    let newIsApprover = IsApprover !== undefined
      ? (IsApprover ? 1 : 0)
      : existingIsApprover;

    if (newIsAdministrator === 1) {
      newIsApprover = 1;
    }

    const normalizedEmail = Email ? Email.trim() : null;
    const userEmail = normalizedEmail || (newIsApprover === 1 ? getDefaultEmail(name.FirstName, name.LastName) : null);

    let passwordMustChange = existingPasswordMustChange;

    // When promoted to approver without an explicit password, require first-time setup
    if (!passwordHash && existingIsApprover === 0 && newIsApprover === 1) {
      passwordMustChange = 1;
    }

    if (passwordHash) {
      passwordMustChange = 0;
    }

    const fields = [
      "FirstName = ?",
      "LastName = ?",
      "Title = ?",
      "Email = ?",
      "IsApprover = ?",
      "IsAdministrator = ?",
      "PasswordMustChange = ?"
    ];

    const params = [name.FirstName, name.LastName, Title || null, userEmail, newIsApprover, newIsAdministrator, passwordMustChange];

    if (passwordHash) {
      fields.push("PasswordHash = ?");
      params.push(passwordHash);
    }

    params.push(id);

    const sql = `UPDATE Employees SET ${fields.join(", ")} WHERE EmployeeID = ?`;

    await db.query(sql, params);

    res.json({ message: "Employee updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete employee record
    await db.query(`DELETE FROM Employees WHERE EmployeeID = ?`, [id]);

    res.json({ message: "Employee deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.revokeAdministrator = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `UPDATE Employees
       SET
         IsApprover = 0,
         IsAdministrator = 0
       WHERE EmployeeID = ?`,
      [id]
    );

    res.json({ message: "Approver access removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `UPDATE Employees SET PasswordHash = NULL, PasswordMustChange = 1 WHERE EmployeeID = ?`,
      [id]
    );

    res.json({ message: "Password reset. The user must set a new password via First Time Setup." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirmation do not match." });
    }

    if (!req.user || Number(req.user.EmployeeID) !== Number(id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const [rows] = await db.query(`SELECT PasswordHash FROM Employees WHERE EmployeeID = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.query(
      `UPDATE Employees SET PasswordHash = ?, PasswordMustChange = 0 WHERE EmployeeID = ?`,
      [passwordHash, id]
    );

    res.json({ message: "Password changed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingPOs = async (req, res) => {
  try {

    const [rows] = await db.query(
      `
            SELECT
                po.*,
                v.VendorName,
                CONCAT_WS(' ', e.FirstName, e.LastName) AS EmployeeName
            FROM PurchaseOrders po
            LEFT JOIN Vendors v
                ON po.VendorID = v.VendorID
            LEFT JOIN Employees e
                ON po.EmployeeID = e.EmployeeID
            WHERE po.Status = 'Pending'
            ORDER BY po.CreatedDate DESC
            `
    );

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};

exports.approvePO = async (req, res) => {
  try {

    const { id } = req.params;

    const { Comments } = req.body;

    await db.query(
      `
            UPDATE PurchaseOrders
            SET
                Status = 'Approved',
                ApprovalComments = ?
            WHERE POID = ?
            `,
      [
        Comments || "",
        id
      ]
    );

    res.json({
      message: "Purchase Order Approved"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};

exports.rejectPO = async (req, res) => {
  try {

    const { id } = req.params;

    const { Comments } = req.body;

    await db.query(
      `
            UPDATE PurchaseOrders
            SET
                Status = 'Rejected',
                ApprovalComments = ?
            WHERE POID = ?
            `,
      [
        Comments || "",
        id
      ]
    );

    res.json({
      message: "Purchase Order Rejected"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};
