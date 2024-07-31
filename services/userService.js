const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

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
    where: { id: id },
    data: { firstName, lastName, maidenName, email, phone, username },
  });
  return user;
};

const updateUserPartial = async (id, updateData) => {
  const user = await prisma.user.update({
    where: { id: id },
    data: updateData,
  });
  return user;
};

const deleteUser = async (id) => {
  const user = await prisma.user.delete({
    where: { id: id },
  });
  return user;
};

module.exports = {
  createUser,
  fetchUsers,
  getUserById,
  updateUser,
  updateUserPartial,
  deleteUser,
};
