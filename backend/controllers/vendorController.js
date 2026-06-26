const db = require("../config/db");

exports.getVendors = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM Vendors ORDER BY VendorName"
    );

    res.json(rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

exports.createVendor = async (req, res) => {
  try {

    const {
      VendorName,
      ContactPerson,
      Email,
      Phone,
      Address
    } = req.body;

    await db.query(
      `
      INSERT INTO Vendors
      (
        VendorName,
        ContactPerson,
        Email,
        Phone,
        Address
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        VendorName,
        ContactPerson,
        Email,
        Phone,
        Address
      ]
    );

    res.json({
      message: "Vendor Created"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};