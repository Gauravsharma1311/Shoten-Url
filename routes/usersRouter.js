const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.post("/", usersController.createUser);
router.post("/login", usersController.loginUser);
router.get("/", usersController.authenticateToken, usersController.fetchUsers);
router.get(
  "/:id",
  usersController.authenticateToken,
  usersController.getUserById
);
router.put(
  "/:id",
  usersController.authenticateToken,
  usersController.updateUser
);
router.patch(
  "/:id",
  usersController.authenticateToken,
  usersController.updateUserPartial
);
router.delete(
  "/:id",
  usersController.authenticateToken,
  usersController.deleteUser
);

module.exports = router;
