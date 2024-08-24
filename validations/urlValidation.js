const { body } = require("express-validator");

const urlValidation = [body("url").isURL().withMessage("Invalid URL")];

module.exports = { urlValidation };
