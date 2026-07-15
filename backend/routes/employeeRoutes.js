const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const employeeController =
    require("../controllers/employeeController");

router.get(
    "/",
    employeeController.getEmployees
);

router.get(
    "/:id",
    employeeController.getEmployeeById
);

router.post(
    "/",
    employeeController.createEmployee
);

router.post(
    "/:id/reset-password",
    employeeController.resetPassword
);

router.put(
    "/:id/revoke-admin",
    employeeController.revokeAdministrator
);

router.put(
    "/:id/change-password",
    auth,
    employeeController.changePassword
);

router.put(
    "/:id",
    employeeController.updateEmployee
);

router.delete(
    "/:id",
    employeeController.deleteEmployee
);

module.exports = router;