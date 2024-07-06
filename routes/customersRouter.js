const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customersController");
const validate = require("../middlewares/validate");
const { customerValidation } = require("../validations/customerValidation");

router.post(
  "/",
  customerValidation,
  validate,
  customerController.createCustomer
);
router.get("/", customerController.fetchCustomers);
router.get("/:id", customerController.getCustomerById);
router.put(
  "/:id",
  customerValidation,
  validate,
  customerController.updateCustomer
);
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
