const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");
const validate = require("../middlewares/validate");
const { urlValidation } = require("../validations/urlValidation");

router.post("/", urlValidation, validate, urlController.storeURL);
router.get("/", urlController.fetchUrls);

module.exports = router;
