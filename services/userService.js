const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  service: config.emailService,
  auth: {
    user: config.emailUser,
    pass: config.emailPassword,
  },
});

const createUser = async (
  firstName,
  lastName,
  maidenName,
  email,
  phone,
  username,
  password
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      maidenName,
      email,
      phone,
      username,
      password: hashedPassword,
    },
  });
  return user;
};

const loginUser = async (username, password) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) {
    throw new Error("Invalid username or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid username or password");
  }

  const token = jwt.sign({ userId: user.id }, config.secretKey, {
    expiresIn: "24h",
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

  const resetUrl = `http://localhost:${config.port}/api/users/reset-password/${resetToken}`;

  await transporter.sendMail({
    to: user.email,
    from: config.emailUser,
    subject: "Password Reset Request",
    text: `You requested a password reset. Please click on the following link or paste it into your browser to complete the process: ${resetUrl}`,
  });

  return resetUrl;
};

const resetPassword = async (resetToken, newPassword) => {
  const user = await prisma.user.findUnique({
    where: { resetToken },
  });

  if (!user || user.resetTokenExpiry < new Date()) {
    throw new Error("Invalid or expired token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { resetToken },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return true;
};

const fetchUsers = async (filters) => {
  const users = await prisma.user.findMany({
    where: filters,
  });
  return users;
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
  });
  return user;
};

const updateUser = async (
  id,
  firstName,
  lastName,
  maidenName,
  email,
  phone,
  username
) => {
  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { firstName, lastName, maidenName, email, phone, username },
  });
  return user;
};

const updateUserPartial = async (id, updateData) => {
  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: updateData,
  });
  return user;
};

const deleteUser = async (id) => {
  const user = await prisma.user.delete({
    where: { id: parseInt(id) },
  });
  return user;
};

const logoutUser = (req) => {
  req.user = null;
  return true;
};

module.exports = {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
  fetchUsers,
  getUserById,
  updateUser,
  updateUserPartial,
  deleteUser,
  logoutUser,
};
