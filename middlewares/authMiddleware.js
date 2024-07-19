const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const config = require("../config/index");
const logger = require("../utils/logger");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      logger.error("Authorization denied. No token provided.");
      return res.status(401).json({
        message: "Authorization denied. No token provided.",
        status: 401,
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      logger.error("Authorization denied. No token provided.");
      return res.status(401).json({
        message: "Authorization denied. No token provided.",
        status: 401,
      });
    }

    jwt.verify(token, config.secretKey, async (err, decoded) => {
      if (err) {
        logger.error("JWT verification error:", err.message);
        return res.status(403).json({
          message: "Forbidden",
          status: 403,
          error: err.message,
        });
      }

      logger.info(`Decoded token: ${JSON.stringify(decoded)}`);

      const user = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
      });

      if (!user) {
        logger.error(`User not found for ID: ${decoded.userId}`);
        return res.status(404).json({
          message: "User not found",
          status: 404,
        });
      }

      req.user = user;
      req.userId = user.id; // Set userId explicitly

      logger.info(`User authenticated: ${user.email}`);

      next();
    });
  } catch (error) {
    logger.error("JWT verification catch block error:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      status: 500,
      error: error.message,
    });
  }
};

module.exports = { authenticateToken };
