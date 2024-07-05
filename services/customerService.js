const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createCustomer = async (firstName, lastName, email) => {
  const customer = await prisma.customer.create({
    data: { firstName, lastName, email },
  });
  return customer;
};

const fetchCustomers = async (filters) => {
  const customers = await prisma.customer.findMany({
    where: filters,
  });
  return customers;
};

const getCustomerById = async (id) => {
  const customer = await prisma.customer.findUnique({
    where: { id: parseInt(id) },
  });
  return customer;
};

const updateCustomer = async (id, firstName, lastName, email) => {
  const customer = await prisma.customer.update({
    where: { id: parseInt(id) },
    data: { firstName, lastName, email },
  });
  return customer;
};

const deleteCustomer = async (id) => {
  const customer = await prisma.customer.delete({
    where: { id: parseInt(id) },
  });
  return customer;
};

module.exports = {
  createCustomer,
  fetchCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
