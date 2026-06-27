const db = require("../config/db");

exports.createPO = async (req, res) => {
    try {

        const {
            EmployeeID,
            VendorID,
            PurchaseDescription,
            ReasonForPurchase,
            EstimatedCost,
            ActualCost,
            InvoiceReceived,
            Notes
        } = req.body;

        const poNumber = `PO-${Date.now()}`;

        await db.query(
            `
            INSERT INTO PurchaseOrders
            (
                PO_Number,
                EmployeeID,
                VendorID,
                PurchaseDescription,
                ReasonForPurchase,
                EstimatedCost,
                ActualCost,
                InvoiceReceived,
                Notes,
                Status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Draft')
            `,
            [
                poNumber,
                EmployeeID,
                VendorID,
                PurchaseDescription,
                ReasonForPurchase,
                EstimatedCost,
                ActualCost,
                InvoiceReceived,
                Notes
            ]
        );

        res.json({
            message: "Purchase Order Created",
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