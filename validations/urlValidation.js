const { body } = require("express-validator");

const urlValidationRules = () => {
  return [
    body("userId")
      .trim()
      .notEmpty()
      .withMessage("User ID is required")
      .isLength({ min: 12, max: 24 })
      .withMessage("Invalid User ID format"),

    body("url")
      .trim()
      .notEmpty()
      .withMessage("URL is required")
      .isURL()
      .withMessage("Invalid URL format"),
  ];
};

module.exports = urlValidationRules;
