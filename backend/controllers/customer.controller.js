// backend/controllers/customer.controller.js
const Customer = require("../models/customer");

// GET
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.json({ status: true, message: "Created", customer });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// UPDATE
exports.updateCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndUpdate(req.params.id, req.body);
    res.json({ status: true, message: "Updated" });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// DELETE
exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ status: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};