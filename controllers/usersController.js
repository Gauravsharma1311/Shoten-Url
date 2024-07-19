const userService = require("../services/userService");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  const { firstName, lastName, maidenName, email, phone, username, password } =
    req.body;

  try {
    const user = await userService.createUser(
      firstName,
      lastName,
      maidenName,
      email,
      phone,
      username,
      password
    );
    res.status(201).json({
      message: "User successfully created",
      user,
      status: 201,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating user",
      error: error.message,
      status: 400,
    });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const token = await userService.loginUser(username, password);
    res.json({ message: "Login successful", token, status: 200 });
  } catch (error) {
    res.status(500).json({
      message: "Error logging in",
      error: error.message,
      status: 500,
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const resetUrl = await userService.forgotPassword(email);
    res.json({
      message: "Password reset email sent",
      resetUrl,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error sending password reset email",
      error: error.message,
      status: 500,
    });
  }
};
const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  try {
    console.log(`Reset token: ${resetToken}`); // Log the reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: resetToken,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired password reset token",
        status: 400,
      });
    }

    console.log(`User found: ${user.email}`);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(`Hashed password: ${hashedPassword}`);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res.status(200).json({
      message: "Password has been reset successfully",
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error resetting password",
      error: error.message,
      status: 500,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({
          message: "Error logging out",
          status: 500,
          error: err.message,
        });
      }

      res.clearCookie("connect.sid");
      return res.status(200).json({
        message: "Logged out successfully",
        status: 200,
      });
    });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({
      message: "Error logging out",
      error: error.message,
      status: 500,
    });
  }
};

const fetchUsers = async (req, res) => {
  const filters = req.query;

  try {
    const users = await userService.fetchUsers(filters);
    res.json({
      message: "Users fetched successfully",
      users,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
      status: 500,
    });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }
    res.json({
      message: "User fetched successfully",
      user,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
      status: 500,
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, maidenName, email, phone, username } = req.body;

  try {
    const updatedUser = await userService.updateUser(
      id,
      firstName,
      lastName,
      maidenName,
      email,
      phone,
      username
    );
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }
    res.json({
      message: "User updated successfully",
      user: updatedUser,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
      status: 500,
    });
  }
};

const updateUserPartial = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedUser = await userService.updateUserPartial(id, updateData);
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }
    res.json({
      message: "User updated successfully",
      user: updatedUser,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
      status: 500,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await userService.deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }
    res.json({
      message: "User deleted successfully",
      user: deletedUser,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
      status: 500,
    });
  }
};
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    logger.info(`Fetching profile for user ID: ${userId}`);

    const profileData = await userService.getProfile(userId);

    if (!profileData) {
      logger.error("User not found while fetching profile.");
      return res.status(404).json({ message: "User not found", status: 404 });
    }

    res.json({
      message: "Profile fetched successfully",
      profile: profileData,
      status: 200,
    });
  } catch (error) {
    logger.error("Profile retrieval error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.id;
    const updatedData = req.body;
    const updatedProfile = await userService.updateProfile(userId, updatedData);

    if (!updatedProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedProfile);
  } catch (error) {
    logger.error("Profile update error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteProfile = async (req, res) => {
  const { userId } = req.user;

  try {
    const deletedUser = await userService.deleteUser(userId);
    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }
    res.json({
      message: "Profile deleted successfully",
      user: deletedUser,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting profile",
      error: error.message,
      status: 500,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  fetchUsers,
  getUserById,
  updateUser,
  updateUserPartial,
  deleteUser,
  getProfile,
  updateProfile,
  deleteProfile,
};
