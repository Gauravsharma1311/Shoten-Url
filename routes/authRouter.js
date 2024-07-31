const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validate = require("../middlewares/validate");
const {
  authValidation,
  loginValidation,
} = require("../validations/authValidation");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/login", loginValidation, validate, authController.loginUser);
router.get(
  "/profile",
  authenticateToken,
  authValidation,
  authController.getUserProfile
);
router.post("/forgot-password", authValidation, authController.forgotPassword);
router.post(
  "/reset-password/:resetToken",
  authValidation,
  authController.resetPassword
);
router.post("/logout", authValidation, authController.logoutUser);

module.exports = router;
