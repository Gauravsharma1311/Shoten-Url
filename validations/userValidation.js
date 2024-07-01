const { body } = require("express-validator");

const userValidationRules = () => {
  return [
    body("firstName")
      .trim()
      .notEmpty()
      .withMessage("First name is required")
      .isString()
      .withMessage("First name must be a string")
      .isLength({ max: 20 })
      .withMessage("First name must be at most 20 characters long")
      .isAlpha("en-US", { ignore: " -" })
      .withMessage("First name must contain only letters and spaces"),

    body("lastName")
      .trim()
      .notEmpty()
      .withMessage("Last name is required")
      .isAlpha("en-US", { ignore: " -" })
      .withMessage("Last name must contain only letters and spaces")
      .isLength({ max: 50 })
      .withMessage("Last name must be at most 50 characters long"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email address is required")
      .isEmail()
      .withMessage("Invalid email address")
      .normalizeEmail(),

    body("phone")
      .trim()
      .notEmpty()
      .withMessage("Mobile number is required")
      .matches(/^\+?[1-9]\d{1,14}$/)
      .withMessage("Invalid mobile number format"),

    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isString()
      .withMessage("Username must be a string"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};

module.exports = {
  userValidationRules,
};
