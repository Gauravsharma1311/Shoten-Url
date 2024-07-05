const { body } = require("express-validator");

const customerValidation = [
  body("firstName").isString().notEmpty().withMessage("First name is required"),
  body("lastName").isString().notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
];

module.exports = { customerValidation };
