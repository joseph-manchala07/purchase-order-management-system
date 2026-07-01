const express = require("express");
const router = express.Router();

const poController =
require("../controllers/poController");

router.post(
  "/",
  poController.createPO
);

router.get(
    "/next-number",
    poController.getNextPONumber
);

router.get(
  "/my/:userid",
  poController.getMyPOs
);

router.get(
    "/pending",
    poController.getPendingPOs
);
router.put(
    "/approve/:id",
    poController.approvePO
);

router.put(
    "/reject/:id",
    poController.rejectPO
);



module.exports = router;