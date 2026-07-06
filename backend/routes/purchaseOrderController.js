const express = require("express");
const router = express.Router();

const purchaseOrderController =
    require("../controllers/purchaseOrderController");

router.get(
    "/pending",
    purchaseOrderController.getPendingPOs
);

router.get(
    "/:id",
    purchaseOrderController.getPurchaseOrderById
);

router.put(
    "/:id/approve",
    purchaseOrderController.approvePO
);

router.put(
    "/:id/reject",
    purchaseOrderController.rejectPO
);

module.exports = router;