const { body } = require("express-validator");

const urlValidation = [
  body("userId").isInt().withMessage("User ID must be an integer"),
  body("url").isURL().withMessage("Valid URL is required"),
];

module.exports = { urlValidation };
