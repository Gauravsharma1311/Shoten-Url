const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createCustomer = (firstName, lastName, email) =>
  prisma.customer.create({ data: { firstName, lastName, email } });

const fetchCustomers = (filters) =>
  prisma.customer.findMany({ where: filters });

const getCustomerById = (id) => prisma.customer.findUnique({ where: { id } });

const updateCustomer = (id, data) =>
  prisma.customer.update({ where: { id }, data });

const deleteCustomer = (id) => prisma.customer.delete({ where: { id } });

module.exports = {
  createCustomer,
  fetchCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
