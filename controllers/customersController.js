const { PrismaClient } = require("@prisma/client");
const customerService = require("../services/customerService");
const prisma = new PrismaClient();

const createCustomer = async (req, res) => {
  const { firstName, lastName, email } = req.body;

  try {
    const customer = await customerService.createCustomer(
      firstName,
      lastName,
      email
    );
    res.status(201).json({
      message: "Customer successfully created",
      customer,
      status: 201,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating customer",
      error: error.message,
      status: 400,
    });
  }
};

const fetchCustomers = async (req, res) => {
  try {
    const customers = await customerService.fetchCustomers();
    res.json({
      message: "Customers fetched successfully",
      customers,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching customers",
      error: error.message,
      status: 500,
    });
  }
};

const getCustomerById = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await customerService.getCustomerById(id);
    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
        status: 404,
      });
    }
    res.json({
      message: "Customer fetched successfully",
      customer,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching customer",
      error: error.message,
      status: 500,
    });
  }
};

const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;

  try {
    const updatedCustomer = await customerService.updateCustomer(
      id,
      firstName,
      lastName,
      email
    );
    if (!updatedCustomer) {
      return res.status(404).json({
        message: "Customer not found",
        status: 404,
      });
    }
    res.json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating customer",
      error: error.message,
      status: 500,
    });
  }
};

const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCustomer = await customerService.deleteCustomer(id);
    if (!deletedCustomer) {
      return res.status(404).json({
        message: "Customer not found",
        status: 404,
      });
    }
    res.json({
      message: "Customer deleted successfully",
      customer: deletedCustomer,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting customer",
      error: error.message,
      status: 500,
    });
  }
};

module.exports = {
  createCustomer,
  fetchCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
