require("dotenv").config();

module.exports = {
  mongoUri: process.env.MYSQL_URI,
  secretKey: process.env.SECRET_KEY,
  port: process.env.PORT || 2500,
  timeZone: process.env.TZ || "UTC",
};
