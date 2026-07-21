const db = require("../config/db");

exports.createPO = async (req, res) => {
    let connection;

    try {
        const {
            EmployeeID,
            ApprovedBy,
            VendorID,
            PurchaseDescription,
            ReasonForPurchase,
            EstimatedCost
        } = req.body;

        const employeeId = Number(EmployeeID);
        const approvedById = Number(ApprovedBy);
        const vendorId = Number(VendorID);
        const estimatedCostValue = Number(EstimatedCost);

        if (!employeeId || !approvedById || !vendorId) {
            return res.status(400).json({
                message: "Employee, approver, and vendor are required."
            });
        }

        if (!PurchaseDescription || !PurchaseDescription.trim()) {
            return res.status(400).json({
                message: "Purchase description is required."
            });
        }

        if (!ReasonForPurchase || !ReasonForPurchase.trim()) {
            return res.status(400).json({
                message: "Reason for purchase is required."
            });
        }

        if (!estimatedCostValue || estimatedCostValue <= 0) {
            return res.status(400).json({
                message: "Estimated cost must be greater than zero."
            });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        let insertResult;

        try {
            [insertResult] = await connection.query(
                `
                INSERT INTO PurchaseOrders
                (
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
                    ?, ?, ?, ?, ?, ?,
                    'Pending Approval',
                    NOW()
                )
                `,
                [
                    employeeId,
                    approvedById,
                    vendorId,
                    PurchaseDescription.trim(),
                    ReasonForPurchase.trim(),
                    estimatedCostValue
                ]
            );
        } catch (error) {
            // Backward compatibility for schemas where PO_Number has no default.
            if (
                error &&
                error.code === "ER_NO_DEFAULT_FOR_FIELD" &&
                String(error.message || "").includes("PO_Number")
            ) {
                [insertResult] = await connection.query(
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
                        0, ?, ?, ?, ?, ?, ?,
                        'Pending Approval',
                        NOW()
                    )
                    `,
                    [
                        employeeId,
                        approvedById,
                        vendorId,
                        PurchaseDescription.trim(),
                        ReasonForPurchase.trim(),
                        estimatedCostValue
                    ]
                );
            } else {
                throw error;
            }
        }

        const generatedPoNumber = Number(insertResult.insertId);

        await connection.query(
            `
            UPDATE PurchaseOrders
            SET PO_Number = ?
            WHERE PO_ID = ?
            `,
            [generatedPoNumber, generatedPoNumber]
        );

        await connection.commit();

        res.json({
            message: "Purchase Order has been submitted for approval",
            poNumber: generatedPoNumber
        });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error(error);

        res.status(500).json({
            message: error.message
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

exports.searchPOs = async (req, res) => {
    try {
        const q = `%${(req.query.q || "").trim()}%`;

        const [rows] = await db.query(
            `
            SELECT
                p.PO_ID,
                p.PO_Number,
                CONCAT_WS(' ', e.FirstName, e.LastName) AS EmployeeName,
                v.VendorName,
                p.PurchaseDescription,
                p.EstimatedCost,
                p.Status,
                p.SubmittedDate,
                p.ApprovedDate,
                CONCAT_WS(' ', a.FirstName, a.LastName) AS ApproverName
            FROM PurchaseOrders p
            LEFT JOIN Vendors v ON p.VendorID = v.VendorID
            LEFT JOIN Employees e ON p.EmployeeID = e.EmployeeID
            LEFT JOIN Employees a ON p.ApprovedBy = a.EmployeeID
            WHERE
                p.PO_Number LIKE ?
                OR p.PurchaseDescription LIKE ?
                OR v.VendorName LIKE ?
                OR CONCAT_WS(' ', e.FirstName, e.LastName) LIKE ?
            ORDER BY p.PO_ID DESC
            LIMIT 100
            `,
            [q, q, q, q]
        );

        res.json(rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({ message: error.message });
    }
};

exports.getAllPOs = async (req, res) => {
    try {
        const [rows] = await db.query(
            `
            SELECT
                p.PO_ID,
                p.PO_Number,
                CONCAT_WS(' ', e.FirstName, e.LastName) AS EmployeeName,
                v.VendorName,
                p.PurchaseDescription,
                p.ReasonForPurchase,
                p.EstimatedCost,
                p.Status,
                p.SubmittedDate,
                p.ApprovedDate,
                CONCAT_WS(' ', a.FirstName, a.LastName) AS ApproverName
            FROM PurchaseOrders p
            LEFT JOIN Vendors v
                ON p.VendorID = v.VendorID
            LEFT JOIN Employees e
                ON p.EmployeeID = e.EmployeeID
            LEFT JOIN Employees a
                ON p.ApprovedBy = a.EmployeeID
            ORDER BY p.PO_ID DESC
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

exports.getMyPOs = async (req, res) => {
    try {
        const employeeID = req.params.userid;

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

exports.getPendingPOs = async (req, res) => {
    try {
        const approverId = Number(req.query.approverId);

        const [rows] = await db.query(
            `
            SELECT
                p.PO_ID,
                p.PO_Number,
                CONCAT_WS(
                    ' ',
                    e.FirstName,
                    e.LastName
                ) AS EmployeeName,
                v.VendorName,
                p.PurchaseDescription,
                p.EstimatedCost,
                p.Status,
                p.CreatedDate,
                p.ApprovedBy

            FROM PurchaseOrders p

            INNER JOIN Employees e
                ON p.EmployeeID = e.EmployeeID

            INNER JOIN Vendors v
                ON p.VendorID = v.VendorID

            WHERE
                p.Status = 'Pending Approval'
                AND p.ApprovedBy = ?

            ORDER BY p.PO_ID DESC
            `,
            [approverId]
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
            message: "Purchase Order Rejected"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
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

exports.getApproverPOHistory = async (req, res) => {
    try {
        const approverID = req.params.userid;

        const [rows] = await db.query(
            `
            SELECT
                p.PO_ID,
                p.PO_Number,
                CONCAT_WS(' ', e.FirstName, e.LastName) AS EmployeeName,
                p.PurchaseDescription,
                p.ReasonForPurchase,
                p.EstimatedCost,
                p.Status,
                p.CreatedDate,
                p.SubmittedDate,
                p.ApprovedDate,
                v.VendorName
            FROM PurchaseOrders p
            LEFT JOIN Vendors v
                ON p.VendorID = v.VendorID
            LEFT JOIN Employees e
                ON p.EmployeeID = e.EmployeeID
            WHERE
                p.ApprovedBy = ?
                AND p.Status IN ('Approved', 'Rejected')
            ORDER BY p.PO_ID DESC
            `,
            [approverID]
        );

        res.json(rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};
