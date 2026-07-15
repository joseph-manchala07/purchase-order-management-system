const express = require("express");
const router = express.Router();

const {
  login,
  firstTimeSetup,
  checkApprover
} = require("../controllers/authController");

router.post("/login", login);
router.post("/check-approver", checkApprover);
router.post("/first-time-setup", firstTimeSetup);

module.exports = router;