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
                Status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending Approval')
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