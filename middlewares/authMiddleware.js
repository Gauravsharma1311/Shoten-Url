const jwt = require("jsonwebtoken");
const config = require("../config");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Invalid token", status: 401 });

  jwt.verify(token, config.secretKey, (err, user) => {
    if (err)
      return res.status(401).json({ error: "Invalid token", status: 401 });
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
