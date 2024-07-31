const jwt = require("jsonwebtoken");
const config = require("../config");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const transporter = nodemailer.createTransport({
  service: config.emailService,
  auth: {
    user: config.emailUser,
    pass: config.emailPassword,
  },
});

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ userId: user.id }, config.secretKey, {
    expiresIn: "1h",
  });
  return token;
};

const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error("Email not found");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

  await prisma.user.update({
    where: { email },
    data: { resetToken, resetTokenExpiry },
  });

  const resetUrl = `http://localhost:${config.port}/api/auth/reset-password/${resetToken}`;

  await transporter.sendMail({
    to: user.email,
    from: config.emailUser,
    subject: "Password Reset Request",
    text: `You requested a password reset. Please click on the following link or paste it into your browser to complete the process: ${resetUrl}`,
  });

  return resetUrl;
};

const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user;
};

const resetPassword = async (resetToken, newPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: resetToken,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new Error("Invalid or expired password reset token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return true;
};

module.exports = {
  loginUser,
  forgotPassword,
  getUserProfile,
  resetPassword,
};
