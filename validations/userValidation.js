const { check, body } = require("express-validator");

const userValidation = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("maidenName").optional().isString(),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("username").notEmpty().withMessage("Username is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = { userValidation, loginValidation };
