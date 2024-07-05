const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");
const { body } = require("express-validator");
const validate = require("../middlewares/validate");

router.post(
  "/",
  [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("username").notEmpty().withMessage("Username is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    validate,
  ],
  userController.createUser
);

router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
    validate,
  ],
  userController.loginUser
);

router.get("/", userController.fetchUsers);

router.get("/:id", userController.getUserById);

router.put(
  "/:id",
  [
    body("firstName")
      .optional()
      .notEmpty()
      .withMessage("First name is required"),
    body("lastName").optional().notEmpty().withMessage("Last name is required"),
    body("email").optional().isEmail().withMessage("Invalid email"),
    body("phone").optional().notEmpty().withMessage("Phone number is required"),
    body("username").optional().notEmpty().withMessage("Username is required"),
    validate,
  ],
  userController.updateUser
);

router.patch("/:id", userController.updateUserPartial);

router.delete("/:id", userController.deleteUser);

module.exports = router;
