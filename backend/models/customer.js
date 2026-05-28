// backend/models/customer.js
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },

    fullname: String,
    phone: String,
    email: String,
    address: String,

    role: { type: String, default: "customer" },
    locked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);