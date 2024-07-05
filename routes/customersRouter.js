const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customersController");
const { body } = require("express-validator");
const validate = require("../middlewares/validate");

router.post(
  "/",
  [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    validate,
  ],
  customerController.createCustomer
);

router.get("/", customerController.fetchCustomers);

router.get("/:id", customerController.getCustomerById);

router.put(
  "/:id",
  [
    body("firstName")
      .optional()
      .notEmpty()
      .withMessage("First name is required"),
    body("lastName").optional().notEmpty().withMessage("Last name is required"),
    body("email").optional().isEmail().withMessage("Invalid email"),
    validate,
  ],
  customerController.updateCustomer
);

router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
