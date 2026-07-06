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
            SELECT *
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
            SELECT *
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
    try {

        const {
            VendorName,
            ContactName,
            Phone,
            Fax,
            Email,
            Address1,
            Address2,
            City,
            State,
            ZipCode,
            Notes
        } = req.body;

        const [result] = await db.query(
            `
            INSERT INTO Vendors
            (
                VendorName,
                ContactName,
                Phone,
                Fax,
                Email,
                Address1,
                Address2,
                City,
                State,
                ZipCode,
                Notes
            )
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                VendorName,
                ContactName,
                Phone,
                Fax,
                Email,
                Address1,
                Address2,
                City,
                State,
                ZipCode,
                Notes
            ]
        );

        res.status(201).json({
            message: "Vendor created successfully",
            VendorID: result.insertId
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
            Address2,
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
                Address2 = ?,
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
                Address2,
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