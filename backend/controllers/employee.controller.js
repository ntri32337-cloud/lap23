// backend/controllers/employee.controller.js
const User = require("../models/user");
const Employee = require("../models/employee");
const bcrypt = require("bcryptjs");

// GET /api/employees
const getAllEmployee = async (req, res) => {
  try {
    const employees = await Employee.find().populate("userId", "-password");

    const result = employees.map((e) => ({
      _id: e.userId._id,
      username: e.userId.username,
      email: e.userId.email,
      role: e.userId.role,
      locked: e.userId.locked,
      permissions: e.userId.permissions,

      image: e.image,
      fullname: e.fullname,
      gender: e.gender,
      phone: e.phone,
      address: e.address,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/employees
const createUserEmployee = async (req, res) => {
  try {
    const { user, employee } = req.body;

    if (!user?.username) return res.json({ status: false, message: "Username is required" });
    if (!user?.email) return res.json({ status: false, message: "Email is required" });
    if (!employee?.fullname) return res.json({ status: false, message: "Fullname is required" });

    const existing = await User.findOne({ username: user.username });
    if (existing) return res.json({ status: false, message: "Username already exists" });

    const emailExist = await User.findOne({ email: user.email });
    if (emailExist) return res.json({ status: false, message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(user.password || "123456", 10);

    const newUser = await User.create({
      username: user.username,
      password: hashedPassword,
      email: user.email,
      role: user.role || "user",
      locked: !!user.locked,
      permissions: user.permissions || [],
    });

    const newEmployee = await Employee.create({
      userId: newUser._id,
      image: employee.image,
      fullname: employee.fullname,
      gender: employee.gender,
      phone: employee.phone,
      address: employee.address,
    });

    return res.json({
      status: true,
      message: "Create successful employees",
      user: newUser,
      employee: newEmployee,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

// PUT /api/employees/:id (id = userId)
const updateUserEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, employee } = req.body;

    if (user?.username !== undefined && !String(user.username).trim())
      return res.json({ status: false, message: "Username cannot be empty" });

    if (user?.email !== undefined && !String(user.email).trim())
      return res.json({ status: false, message: "Email cannot be empty" });

    if (employee?.fullname !== undefined && !String(employee.fullname).trim())
      return res.json({ status: false, message: "Fullname cannot be empty" });

    const usernameExist = await User.findOne({ username: user.username, _id: { $ne: id } });
    if (usernameExist) return res.json({ status: false, message: "Username already exists" });

    const emailExist = await User.findOne({ email: user.email, _id: { $ne: id } });
    if (emailExist) return res.json({ status: false, message: "Email already exists" });

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...user, permissions: user?.permissions },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // ✅ dùng returnDocument:'after' để tránh warning
    const updatedEmployee = await Employee.findOneAndUpdate(
      { userId: id },
      employee,
      { returnDocument: "after" }
    );

    res.json({
      status: true,
      message: "Update successful employee",
      user: updatedUser,
      employee: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// DELETE /api/employees/:id
const deleteUserEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findOneAndDelete({ userId: id });
    await User.findByIdAndDelete(id);
    res.json({ status: true, message: "Delete successful employee" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  getAllEmployee,
  createUserEmployee,
  updateUserEmployee,
  deleteUserEmployee,
};
