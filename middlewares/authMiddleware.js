// authMiddleware.js
const jwt = require("jsonwebtoken");
const config = require("../config");
const logger = require("../utils/logger");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res
      .status(403)
      .json({ message: "Forbidden", status: 403, error: "No token provided" });
  }

  jwt.verify(token, config.secretKey, (err, user) => {
    if (err) {
      logger.error(`JWT verification error: ${err.message}`);
      return res
        .status(403)
        .json({ message: "Forbidden", status: 403, error: "jwt malformed" });
    }

    req.user = user;
    logger.info(`User authenticated: ${JSON.stringify(user)}`);
    next();
  });
};

module.exports = { authenticateToken };
