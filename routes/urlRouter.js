const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");
const validate = require("../middlewares/validate");
const { urlValidation } = require("../validations/urlValidation");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post(
  "/",
  authenticateToken,
  urlValidation,
  validate,
  urlController.storeURL
);
router.get("/", authenticateToken, urlController.fetchUrls);

module.exports = router;
