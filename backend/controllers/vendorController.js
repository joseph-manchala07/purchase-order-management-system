const db = require("../config/db");

/*
--------------------------------------------------
GET ALL VENDORS
--------------------------------------------------
*/
exports.getVendors = async (req, res) => {
    try {

        const [rows] = await db.query(
            `
            SELECT
                VendorID,
                VendorName,
                ContactName,
                Phone,
                Fax,
                Email,
                Address1,
                City,
                State,
                ZipCode,
                Notes,
                CreatedDate
            FROM Vendors
            ORDER BY VendorName
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

/*
--------------------------------------------------
GET VENDOR BY ID
--------------------------------------------------
*/
exports.getVendorById = async (req, res) => {
    try {

        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT
                VendorID,
                VendorName,
                ContactName,
                Phone,
                Fax,
                Email,
                Address1,
                City,
                State,
                ZipCode,
                Notes,
                CreatedDate
            FROM Vendors
            WHERE VendorID = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Vendor not found"
            });
        }

        res.json(rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }
};

/*
--------------------------------------------------
CREATE VENDOR
--------------------------------------------------
*/
exports.createVendor = async (req, res) => {
    let connection;

    try {

        const {
            VendorName,
            ContactName,
            Phone,
            Fax,
            Email,
            Address1,
            City,
            State,
            ZipCode,
            Notes
        } = req.body;

        connection = await db.getConnection();

        let result;
        let inserted = false;

        // Set VendorID to the next value after the highest existing VendorID.
        for (let attempt = 0; attempt < 5 && !inserted; attempt += 1) {
            const [nextVendorRows] = await connection.query(
                `
                SELECT COALESCE(MAX(VendorID), 0) + 1 AS NextVendorID
                FROM Vendors
                `
            );

            const nextVendorId = Number(nextVendorRows[0]?.NextVendorID || 1);

            try {
                [result] = await connection.query(
                    `
                    INSERT INTO Vendors
                    (
                        VendorID,
                        VendorName,
                        ContactName,
                        Phone,
                        Fax,
                        Email,
                        Address1,
                        City,
                        State,
                        ZipCode,
                        Notes
                    )
                    VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `,
                    [
                        nextVendorId,
                        VendorName,
                        ContactName,
                        Phone,
                        Fax,
                        Email,
                        Address1,
                        City,
                        State,
                        ZipCode,
                        Notes
                    ]
                );

                inserted = true;
            } catch (insertError) {
                if (!(insertError && insertError.code === "ER_DUP_ENTRY")) {
                    throw insertError;
                }
            }
        }

        if (!inserted) {
            throw new Error("Unable to assign VendorID. Please try again.");
        }

        res.status(201).json({
            message: "Vendor created successfully",
            VendorID: result.insertId
        });

    } catch (error) {

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

/*
--------------------------------------------------
UPDATE VENDOR
--------------------------------------------------
*/
exports.updateVendor = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            VendorName,
            ContactName,
            Phone,
            Fax,
            Email,
            Address1,
            City,
            State,
            ZipCode,
            Notes
        } = req.body;

        await db.query(
            `
            UPDATE Vendors
            SET
                VendorName = ?,
                ContactName = ?,
                Phone = ?,
                Fax = ?,
                Email = ?,
                Address1 = ?,
                City = ?,
                State = ?,
                ZipCode = ?,
                Notes = ?
            WHERE VendorID = ?
            `,
            [
                VendorName,
                ContactName,
                Phone,
                Fax,
                Email,
                Address1,
                City,
                State,
                ZipCode,
                Notes,
                id
            ]
        );

        res.json({
            message: "Vendor updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }
};

/*
--------------------------------------------------
DELETE VENDOR
--------------------------------------------------
*/
exports.deleteVendor = async (req, res) => {
    try {

        const { id } = req.params;

        console.log("Deleting Vendor:", id);

        const [result] = await db.query(
            `
            DELETE FROM Vendors
            WHERE VendorID = ?
            `,
            [id]
        );

        console.log(result);

        res.json({
            message: "Vendor deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }
};