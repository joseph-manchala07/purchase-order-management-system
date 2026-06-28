const db = require("../config/db");

exports.createPO = async (req, res) => {
    try {

        const {
            EmployeeID,
            ApprovedBy,
            VendorID,
            PurchaseDescription,
            ReasonForPurchase,
            EstimatedCost,
            ActualCost,
            InvoiceReceived
        } = req.body;


        const [rows] = await db.query(`
            SELECT COALESCE(MAX(PO_Number), 0) AS LastPO
            FROM PurchaseOrders
        `);

        const poNumber = rows[0].LastPO + 1;
        


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
                ActualCost,
                InvoiceReceived,
                Status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Draft')
            `,
            [
                poNumber,
                EmployeeID,
                ApprovedBy,
                VendorID,
                PurchaseDescription,
                ReasonForPurchase,
                Number(EstimatedCost) || 0,
                Number(ActualCost) || 0,
                InvoiceReceived
            ]
        );
        res.json({
            message: "Purchase Order has been submitted for Approval",
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

        const employeeID = req.params.userid;

        const [rows] = await db.query(
            `
            SELECT
                p.PO_Number,
                p.PurchaseDescription,
                p.ReasonForPurchase,
                p.EstimatedCost,
                p.ActualCost,
                p.Status,
                p.CreatedDate,
                v.VendorName
            FROM PurchaseOrders p
            LEFT JOIN Vendors v
                ON p.VendorID = v.VendorID
            WHERE p.EmployeeID = ?
            ORDER BY p.CreatedDate DESC
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
            SELECT COALESCE(MAX(PO_Number), 0) AS LastPO
            FROM PurchaseOrders
        `);

        res.json({
            poNumber: rows[0].LastPO + 1
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};
``