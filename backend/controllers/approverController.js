const db = require("../config/db");

exports.getApprovers = async (req, res) => {
    try {

        const [rows] = await db.query(`
            SELECT *
            FROM Approvers
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

exports.createApprover = async (req, res) => {
    try {

        const {
            EmployeeName,
            Title,
            Active
        } = req.body;

        await db.query(
            `
            INSERT INTO Approvers
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
            message: "Approver Added"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};
exports.getApprovedPO = async (req, res) => {
    try {

        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT
                p.*,
                e.EmployeeName,
                a.EmployeeName AS ApproverName,
                v.VendorName
            FROM PurchaseOrders p

            LEFT JOIN Employees e
                ON p.EmployeeID = e.EmployeeID

            LEFT JOIN Approvers a
                ON p.ApprovedBy = a.ApproverID

            LEFT JOIN Vendors v
                ON p.VendorID = v.VendorID

            WHERE p.PO_ID = ?
            `,
            [id]
        );

        res.json(rows[0]);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};