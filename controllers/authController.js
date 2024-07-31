const authService = require("../services/authService");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await authService.loginUser(email, password);
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
    const resetUrl = await authService.forgotPassword(email);
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

const getUserProfile = async (req, res) => {
  const { userId } = req.user;

  console.log(`Fetching profile for userId: ${userId}`);

  try {
    const user = await authService.getUserProfile(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", status: 404 });
    }
    res.json({
      message: "User profile fetched successfully",
      user,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user profile",
      error: error.message,
      status: 500,
    });
  }
};

module.exports = {
  loginUser,
  logoutUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
};
