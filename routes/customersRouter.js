const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customersController");
const validate = require("../middlewares/validate");
const { customerValidation } = require("../validations/customerValidation");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post(
  "/",
  authenticateToken,
  customerValidation,
  validate,
  customerController.createCustomer
);
router.get("/", authenticateToken, customerController.fetchCustomers);
router.get("/:id", authenticateToken, customerController.getCustomerById);
router.put(
  "/:id",
  authenticateToken,
  customerValidation,
  validate,
  customerController.updateCustomer
);
router.delete("/:id", authenticateToken, customerController.deleteCustomer);

module.exports = router;
