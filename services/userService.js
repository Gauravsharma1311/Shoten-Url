const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");

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
    expiresIn: "1h",
  });
  return token;
};

const fetchUsers = async (filters) => {
  const users = await prisma.user.findMany({
    where: filters,
  });
  return users;
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
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

module.exports = {
  createUser,
  loginUser,
  fetchUsers,
  getUserById,
  updateUser,
  updateUserPartial,
  deleteUser,
};
