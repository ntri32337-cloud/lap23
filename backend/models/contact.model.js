const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  reply: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "pending", // pending | replied
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);