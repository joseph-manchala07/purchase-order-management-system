const express = require("express");
const router = express.Router();

const approverController =
    require("../controllers/approverController");

router.get(
    "/",
    approverController.getApprovers
);

router.post(
    "/",
    approverController.createApprover
);

module.exports = router;