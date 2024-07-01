const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");
const urlValidationRules = require("../validations/urlValidation");
const validate = require("../middlewares/validate");

router.post("/", urlValidationRules(), validate, urlController.storeURL);
router.get("/", urlController.fetchUrls);

module.exports = router;
