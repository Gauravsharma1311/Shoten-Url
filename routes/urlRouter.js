const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");
const { body } = require("express-validator");
const validate = require("../middlewares/validate");

router.post(
  "/",
  [body("url").isURL().withMessage("Invalid URL"), validate],
  urlController.storeURL
);

router.get("/", urlController.fetchUrls);

module.exports = router;
