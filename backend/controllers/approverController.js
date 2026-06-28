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