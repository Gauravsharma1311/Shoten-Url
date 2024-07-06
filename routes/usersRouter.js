const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");
const validate = require("../middlewares/validate");
const {
  userValidation,
  loginValidation,
} = require("../validations/userValidation");

router.post("/", userValidation, validate, userController.createUser);
router.post("/login", loginValidation, validate, userController.loginUser);
router.get("/", userController.fetchUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userValidation, validate, userController.updateUser);
router.patch(
  "/:id",
  userValidation,
  validate,
  userController.updateUserPartial
);
router.delete("/:id", userController.deleteUser);

module.exports = router;
