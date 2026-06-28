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



module.exports = router;