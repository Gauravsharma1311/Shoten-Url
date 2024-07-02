const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createCustomer = async (firstName, lastName, email) => {
  const existingCustomer = await prisma.customer.findUnique({
    where: { email },
  });
  if (existingCustomer)
    throw new Error("Customer with this email already exists");

  return await prisma.customer.create({ data: { firstName, lastName, email } });
};

const fetchCustomers = async (filters) => {
  const where = {};

  if (filters.firstName) {
    where.firstName = { contains: filters.firstName, mode: "insensitive" };
  }

  if (filters.lastName) {
    where.lastName = { contains: filters.lastName, mode: "insensitive" };
  }

  if (filters.email) {
    where.email = { contains: filters.email, mode: "insensitive" };
  }

  return await prisma.customer.findMany({ where });
};

const getCustomerById = async (id) => {
  return await prisma.customer.findUnique({ where: { id } });
};

const updateCustomer = async (id, firstName, lastName, email) => {
  return await prisma.customer.update({
    where: { id },
    data: { firstName, lastName, email },
  });
};

const deleteCustomer = async (id) => {
  return await prisma.customer.delete({ where: { id } });
};

module.exports = {
  createCustomer,
  fetchCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
