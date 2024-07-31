const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");
const validate = require("../middlewares/validate");
const { userValidation } = require("../validations/userValidation");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/", userValidation, validate, userController.createUser);
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

module.exports = router;
