const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employeeController");

// Forward approver routes to employeeController using IsApprover flag
router.get("/", (req, res) => {
    req.query = req.query || {};
    req.query.isApprover = "1";
    return employeeController.getEmployees(req, res);
});

router.get("/:id", (req, res) => {
    return employeeController.getEmployeeById(req, res);
});

router.post("/", (req, res) => {
    req.body = req.body || {};
    return employeeController.createOrEnableApprover(req, res);
});

router.put("/:id", (req, res) => {
    return employeeController.updateEmployee(req, res);
});

router.delete("/:id", (req, res) => {
    return employeeController.deleteEmployee(req, res);
});

module.exports = router;