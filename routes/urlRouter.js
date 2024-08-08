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
router.get("/usernames", authenticateToken, urlController.fetchUsernames);
router.get("/:id", authenticateToken, urlController.fetchUrlById); // Fetch URL by ID
router.put(
  "/:id",
  authenticateToken,
  urlValidation,
  validate,
  urlController.updateURL
);
router.delete("/:id", authenticateToken, urlController.deleteURL);

module.exports = router;
