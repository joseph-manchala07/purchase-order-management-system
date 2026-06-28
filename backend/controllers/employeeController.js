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