const { body } = require("express-validator");

const urlValidation = [
  body("userId").isString().withMessage("userId must be a string"),
  body("url").isURL().withMessage("Invalid URL"),
];

module.exports = { urlValidation };
