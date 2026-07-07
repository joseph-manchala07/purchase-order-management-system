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

// Get employees.
// Optional query: ?isApprover=1 to filter approvers
exports.getEmployees = async (req, res) => {
  try {
    const isApprover = req.query.isApprover;

    let sql = `
            SELECT
                EmployeeID,
                FirstName,
                LastName,
                CONCAT_WS(' ', FirstName, LastName) AS EmployeeName,
                Title,
                Email,
                IsApprover,
                CreatedDate
            FROM Employees
        `;

    const params = [];

    if (isApprover === "1") {
      sql += " WHERE IsApprover = 1";
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
  try {
    const { EmployeeName, FirstName, LastName, Title, Email, IsApprover = 0, Password } = req.body;
    const name = parseEmployeeName(EmployeeName, FirstName, LastName);
    const isApproverInt = IsApprover == 1 ? 1 : 0;

    let passwordHash = null;
    const normalizedEmail = Email ? Email.trim() : null;
    const userEmail = normalizedEmail || (isApproverInt === 1 ? getDefaultEmail(name.FirstName, name.LastName) : null);

    if (isApproverInt === 1) {
      const pwd = Password || process.env.DEFAULT_USER_PASSWORD || "DefaultPass123!";
      passwordHash = await bcrypt.hash(pwd, 10);
    }

    const passwordMustChange = isApproverInt === 1 && !Password ? 1 : 0;

    await db.query(
      `
            INSERT INTO Employees
            (
                FirstName,
                LastName,
                Title,
                Email,
                IsApprover,
                PasswordHash,
                PasswordMustChange,
                CreatedDate
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
            `,
      [name.FirstName, name.LastName, Title || null, userEmail, isApproverInt, passwordHash, passwordMustChange]
    );

    res.json({ message: "Employee added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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
                Title,
                Email,
                IsApprover,
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
    const { EmployeeName, FirstName, LastName, Title, Email, IsApprover, Password } = req.body;
    const name = parseEmployeeName(EmployeeName, FirstName, LastName);

    // fetch existing approver flag and password-change state
    const [existingRows] = await db.query(
      `SELECT IsApprover, IFNULL(PasswordMustChange, 0) AS PasswordMustChange
       FROM Employees
       WHERE EmployeeID = ?`,
      [id]
    );
    const existingIsApprover = existingRows && existingRows[0] ? (existingRows[0].IsApprover ? 1 : 0) : 0;
    const existingPasswordMustChange = existingRows && existingRows[0] ? (existingRows[0].PasswordMustChange ? 1 : 0) : 0;

    let passwordHash = undefined;
    if (Password) {
      passwordHash = await bcrypt.hash(Password, 10);
    }

    const newIsApprover = IsApprover ? 1 : 0;
    const normalizedEmail = Email ? Email.trim() : null;
    const userEmail = normalizedEmail || (newIsApprover === 1 ? getDefaultEmail(name.FirstName, name.LastName) : null);

    let passwordMustChange = existingPasswordMustChange;

    // Auto-reset password when promoted to approver and no explicit Password provided
    if (!passwordHash && existingIsApprover === 0 && newIsApprover === 1) {
      const defaultPassword = process.env.DEFAULT_USER_PASSWORD || "DefaultPass123!";
      passwordHash = await bcrypt.hash(defaultPassword, 10);
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
      "PasswordMustChange = ?"
    ];

    const params = [name.FirstName, name.LastName, Title || null, userEmail, newIsApprover, passwordMustChange];

    if (passwordHash) {
      fields.push("PasswordHash = ?");
      params.push(passwordHash);
    }

    params.push(id);

    const sql = `UPDATE Employees SET ${fields.join(", ")} WHERE EmployeeID = ?`;

    await db.query(sql, params);

    const responsePayload = { message: "Employee updated" };
    if (passwordHash && existingIsApprover === 0 && newIsApprover === 1 && !Password) {
      responsePayload.passwordReset = true;
      responsePayload.passwordNote = "Password was reset to default for the new administrator.";
    }

    res.json(responsePayload);
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

exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const defaultPassword = process.env.DEFAULT_USER_PASSWORD || "DefaultPass123!";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    await db.query(`UPDATE Employees SET PasswordHash = ? WHERE EmployeeID = ?`, [passwordHash, id]);

    res.json({ message: "Password reset to default." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;

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

    const validCurrent = await bcrypt.compare(currentPassword || "", rows[0].PasswordHash);

    if (!validCurrent) {
      return res.status(401).json({ message: "Current password is incorrect" });
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
