const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const config = require("../config");
const prisma = new PrismaClient();

const createUser = async (
  firstName,
  lastName,
  maidenName,
  email,
  phone,
  username,
  password
) => {
  const existingUserByEmail = await prisma.user.findUnique({
    where: { email },
  });
  const existingUserByUsername = await prisma.user.findUnique({
    where: { username },
  });
  const existingUserByPhone = await prisma.user.findUnique({
    where: { phone },
  });

  if (existingUserByEmail)
    throw new Error("User with this email already exists");
  if (existingUserByUsername)
    throw new Error("User with this username already exists");
  if (existingUserByPhone)
    throw new Error("User with this phone number already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
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
};

const loginUser = async (username, password) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new Error("Invalid username or password");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid username or password");

  const token = jwt.sign(
    { id: user.id, username: user.username },
    config.secretKey,
    { expiresIn: "1h" }
  );
  return token;
};

const fetchUsers = async () => {
  return await prisma.user.findMany();
};

const getUserById = async (id) => {
  return await prisma.user.findUnique({ where: { id } });
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
  return await prisma.user.update({
    where: { id },
    data: { firstName, lastName, maidenName, email, phone, username },
  });
};

const updateUserPartial = async (id, updateData) => {
  return await prisma.user.update({
    where: { id },
    data: updateData,
  });
};

const deleteUser = async (id) => {
  return await prisma.user.delete({ where: { id } });
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
