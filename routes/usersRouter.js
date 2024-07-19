const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");
const validate = require("../middlewares/validate");
const {
  userValidation,
  loginValidation,
} = require("../validations/userValidation");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/", userValidation, validate, userController.createUser);
router.post("/login", loginValidation, validate, userController.loginUser);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password/:resetToken", userController.resetPassword);
router.post("/logout", userController.logoutUser);
router.get("/", authenticateToken, userController.fetchUsers);
router.get("/:id", authenticateToken, userController.getUserById);
router.put(
  "/:id",
  authenticateToken,
  userValidation,
  validate,
  userController.updateUser
);
router.patch(
  "/:id",
  authenticateToken,
  userValidation,
  validate,
  userController.updateUserPartial
);
router.delete("/:id", authenticateToken, userController.deleteUser);

router.get("/profile", authenticateToken, userController.getUserProfile);

module.exports = router;
