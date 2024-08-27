const customerService = require("../services/customerService");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createCustomer = async (req, res) => {
  try {
    const customer = await customerService.createCustomer(
      req.body.firstName,
      req.body.lastName,
      req.body.email
    );
    res
      .status(201)
      .json({ message: "Customer created", customer, status: 201 });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating customer", error: error.message });
  }
};

const fetchCustomers = async (req, res) => {
  const { pageNumber = 1, pageSize = 10, ...filters } = req.query;
  try {
    const [totalCount, customers] = await prisma.$transaction([
      prisma.customer.count({ where: filters }),
      prisma.customer.findMany({
        where: filters,
        skip: (pageNumber - 1) * pageSize,
        take: parseInt(pageSize),
      }),
    ]);
    res.json({
      message: "Customers fetched",
      data: {
        customers,
        pagination: {
          pageNumber,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      },
      status: 200,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching customers", error: error.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    customer
      ? res.json({ data: { customer }, status: 200 })
      : res.status(404).json({ message: "Customer not found", status: 404 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching customer", error: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await customerService.updateCustomer(
      req.params.id,
      req.body
    );
    updatedCustomer
      ? res.json({
          message: "Customer updated",
          customer: updatedCustomer,
          status: 200,
        })
      : res.status(404).json({ message: "Customer not found", status: 404 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating customer", error: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await customerService.deleteCustomer(req.params.id);
    deletedCustomer
      ? res.json({
          message: "Customer deleted",
          customer: deletedCustomer,
          status: 200,
        })
      : res.status(404).json({ message: "Customer not found", status: 404 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting customer", error: error.message });
  }
};

module.exports = {
  createCustomer,
  fetchCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
