const express = require("express");
const usersController = require("../controllers/usersController");
const { userValidationRules } = require("../validations/userValidation");
const validate = require("../middlewares/validate");

const router = express.Router();

router.post("/", userValidationRules(), validate, usersController.createUser);
router.post("/login", usersController.loginUser);
router.get("/", usersController.fetchUsers);
router.get("/:id", usersController.getUserById);
router.put("/:id", usersController.updateUser);
router.patch("/:id", usersController.updateUserPartial);
router.delete("/:id", usersController.deleteUser);

module.exports = router;
