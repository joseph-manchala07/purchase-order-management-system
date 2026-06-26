const db = require("../config/db");

exports.createPO = async (req, res) => {
  try {

    const {
      UserID,
      VendorID,
      Description,
      Amount
    } = req.body;

    const poNumber =
      `PO-${Date.now()}`;

    await db.query(
      `
      INSERT INTO PurchaseOrders
      (
        PONumber,
        UserID,
        VendorID,
        Description,
        Amount
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        poNumber,
        UserID,
        VendorID,
        Description,
        Amount
      ]
    );

    res.json({
      message: "PO Created",
      PONumber: poNumber
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

exports.getMyPOs = async (req, res) => {
  try {

    const userID = req.params.userid;

    const [rows] = await db.query(
      `
      SELECT
        p.*,
        v.VendorName
      FROM PurchaseOrders p
      LEFT JOIN Vendors v
      ON p.VendorID = v.VendorID
      WHERE p.UserID = ?
      ORDER BY p.CreatedDate DESC
      `,
      [userID]
    );

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};