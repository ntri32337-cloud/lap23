// backend/models/employee.js
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 1–1
    },
    fullname: String,
    phone: String,
    image: String,
    address: String,
    gender: { type: String, enum: ["male", "female"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);