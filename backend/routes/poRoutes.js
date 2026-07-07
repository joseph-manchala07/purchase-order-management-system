const express = require("express");
const router = express.Router();

const poController = require("../controllers/poController");

router.post("/", poController.createPO);
router.get("/next-number", poController.getNextPONumber);
router.get("/my/:userid", poController.getMyPOs);
router.get("/pending", poController.getPendingPOs);
router.get("/details/:id", poController.getPOById);
router.get("/approved/:id", poController.getApprovedPO);
router.get("/:id", poController.getPOById);
router.put("/approve/:id", poController.approvePO);
router.put("/reject/:id", poController.rejectPO);
router.put("/:id/approve", poController.approvePO);
router.put("/:id/reject", poController.rejectPO);

module.exports = router;