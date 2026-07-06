const db = require("../config/db");

exports.getEmployees = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT *
            FROM Employees
            WHERE Active = 1
            ORDER BY EmployeeName
        `);

        res.json(rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

exports.createEmployee = async (req, res) => {
    try {

        const {
            EmployeeName,
            Title,
            Active
        } = req.body;

        await db.query(
            `
            INSERT INTO Employees
            (
                EmployeeName,
                Title,
                Active
            )
            VALUES (?, ?, ?)
            `,
            [
                EmployeeName,
                Title,
                Active
            ]
        );

        res.json({
            message: "Employee Added"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};
exports.getPendingPOs = async (req, res) => {
    try {

        const [rows] = await db.query(
            `
            SELECT
                po.*,
                v.VendorName,
                e.EmployeeName
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