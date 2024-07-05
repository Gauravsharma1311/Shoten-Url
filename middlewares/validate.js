const { validationResult } = require("express-validator");
const logger = require("../utils/logger");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

    logger.error(`Validation errors: ${JSON.stringify(extractedErrors)}`);

    return res.status(422).json({
      errors: extractedErrors,
    });
  }
  next();
};

module.exports = validate;
