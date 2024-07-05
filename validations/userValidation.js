const { body } = require("express-validator");

const userValidation = [
  body("firstName").isString().notEmpty().withMessage("First name is required"),
  body("lastName").isString().notEmpty().withMessage("Last name is required"),
  body("maidenName").optional().isString(),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").isString().notEmpty().withMessage("Phone number is required"),
  body("username").isString().notEmpty().withMessage("Username is required"),
  body("password").isString().notEmpty().withMessage("Password is required"),
];

const loginValidation = [
  body("username").isString().notEmpty().withMessage("Username is required"),
  body("password").isString().notEmpty().withMessage("Password is required"),
];

module.exports = { userValidation, loginValidation };
