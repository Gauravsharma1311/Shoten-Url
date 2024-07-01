const express = require("express");
const customersController = require("../controllers/customersController");
const customerValidationRules = require("../validations/customerValidation");
const validate = require("../middlewares/validate");

const router = express.Router();

router.post(
  "/",
  customerValidationRules(),
  validate,
  customersController.createCustomer
);
router.get("/", customersController.fetchCustomers);
router.get("/:id", customersController.getCustomerById);
router.put("/:id", customersController.updateCustomer);
router.delete("/:id", customersController.deleteCustomer);

module.exports = router;
