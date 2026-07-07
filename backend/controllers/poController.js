const db = require("../config/db");

exports.createPO = async (req, res) => {
    try {

        const {
            EmployeeID,
            ApprovedBy,
            VendorID,
            PurchaseDescription,
            ReasonForPurchase,
            EstimatedCost
        } = req.body;

        const [rows] = await db.query(`
            SELECT COALESCE(
                MAX(CAST(PO_Number AS UNSIGNED)),
                0
            ) AS LastPO
            FROM PurchaseOrders
        `);

        const poNumber =
            Number(rows[0].LastPO) + 1;

        await db.query(
            `
            INSERT INTO PurchaseOrders
            (
                PO_Number,
                EmployeeID,
                ApprovedBy,
                VendorID,
                PurchaseDescription,
                ReasonForPurchase,
                EstimatedCost,
                Status,
                SubmittedDate
            )
            VALUES
            (
                ?, ?, ?, ?, ?, ?, ?,
                'Pending Approval',
                NOW()
            )
            `,
            [
                poNumber,
                EmployeeID,
                ApprovedBy,
                VendorID,
                PurchaseDescription,
                ReasonForPurchase,
                Number(EstimatedCost) || 0
            ]
        );

        res.json({
            message:
                "Purchase Order has been submitted for Approval",
            poNumber
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }
};

exports.getMyPOs = async (req, res) => {
    try {

        const employeeID =
            req.params.userid;

        const [rows] = await db.query(
            `
            SELECT
                p.PO_ID,
                p.PO_Number,
                p.PurchaseDescription,
                p.ReasonForPurchase,
                p.EstimatedCost,
                p.Status,
                p.CreatedDate,
                p.SubmittedDate,
                v.VendorName
            FROM PurchaseOrders p
            LEFT JOIN Vendors v
                ON p.VendorID = v.VendorID
            WHERE p.EmployeeID = ?
            ORDER BY p.PO_ID DESC
            `,
            [employeeID]
        );

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }
};

exports.getNextPONumber = async (req, res) => {
    try {

        const [rows] = await db.query(`
            SELECT COALESCE(
                MAX(CAST(PO_Number AS UNSIGNED)),
                0
            ) AS LastPO
            FROM PurchaseOrders
        `);

        res.json({
            poNumber:
                Number(rows[0].LastPO) + 1
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

        const [rows] = await db.query(`
            SELECT
                p.PO_ID,
                p.PO_Number,
                CONCAT_WS(' ', e.FirstName, e.LastName) AS EmployeeName,
                v.VendorName,
                p.EstimatedCost,
                p.Status,
                p.CreatedDate
            FROM PurchaseOrders p

            INNER JOIN Employees e
                ON p.EmployeeID = e.EmployeeID

            INNER JOIN Vendors v
                ON p.VendorID = v.VendorID

            WHERE p.Status =
                'Pending Approval'

            ORDER BY p.PO_ID DESC
        `);

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

        const { id } =
            req.params;

        await db.query(
            `
            UPDATE PurchaseOrders
            SET
                Status='Approved',
                ApprovedDate=NOW()
            WHERE PO_ID=?
            `,
            [id]
        );

        res.json({
            message:
                "Purchase Order Approved"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:error.message
        });

    }
};
exports.rejectPO = async (req, res) => {
    try {

        const { id } =
            req.params;

        await db.query(
            `
            UPDATE PurchaseOrders
            SET
                Status='Rejected'
            WHERE PO_ID=?
            `,
            [id]
        );

        res.json({
            message:
                "Purchase Order Rejected"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:error.message
        });

    }
};
exports.getPOById = async (req, res) => {
    try {

        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT
                p.*,
                CONCAT_WS(' ', e.FirstName, e.LastName) AS EmployeeName,
                CONCAT_WS(' ', a.FirstName, a.LastName) AS ApproverName,
                v.VendorName
            FROM PurchaseOrders p

            LEFT JOIN Employees e
                ON p.EmployeeID = e.EmployeeID

            LEFT JOIN Employees a
                ON p.ApprovedBy = a.EmployeeID

            LEFT JOIN Vendors v
                ON p.VendorID = v.VendorID

            WHERE p.PO_ID = ?
            `,
            [id]
        );

        res.json(rows[0]);

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

                CONCAT_WS(' ', e.FirstName, e.LastName) AS EmployeeName,
                e.Title AS EmployeeTitle,

                CONCAT_WS(' ', a.FirstName, a.LastName) AS ApproverName,
                a.Title AS ApproverTitle,

                v.VendorName,
                v.Phone,
                v.Fax,
                v.Address1,
                v.Address2,
                v.City,
                v.State,
                v.ZipCode,
                v.Notes

            FROM PurchaseOrders p

            LEFT JOIN Employees e
                ON p.EmployeeID = e.EmployeeID

            LEFT JOIN Employees a
                ON p.ApprovedBy = a.EmployeeID

            LEFT JOIN Vendors v
                ON p.VendorID = v.VendorID

            WHERE p.PO_ID = ?
            `,
            [id]
        );

        res.json(rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }
};