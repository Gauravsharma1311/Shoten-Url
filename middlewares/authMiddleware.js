const jwt = require("jsonwebtoken");
const config = require("../config");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ message: "Unauthorized", status: 401 });
  }
  next();
  jwt.verify(token, config.secretKey, (err, user) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res
        .status(403)
        .json({ message: "Forbidden", status: 403, error: err.message });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
