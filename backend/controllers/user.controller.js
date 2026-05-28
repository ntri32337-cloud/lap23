// backend/controllers/user.controller.js
const User = require("../models/user");
const Employee = require("../models/employee");
const bcrypt = require("bcryptjs");

// ======================
// GET /api/users  (Lab21)
// ======================
const getUsers = async (req, res) => {
  try {
    const employees = await Employee.find().populate(
      "userId",
      "username password email role locked permissions"
    );

    const result = employees.map((e) => ({
      _id: e.userId._id,
      username: e.userId.username,
      password: e.userId.password,
      email: e.userId.email,
      role: e.userId.role,
      locked: e.userId.locked,
      permissions: e.userId.permissions,
      fullname: e.fullname,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================================
// GET /api/users/permissions  (Lab22 Bài 1)
// =======================================
const getUsersPermission = async (req, res) => {
  try {
    const employees = await Employee.find().populate(
      "userId",
      "username password email role locked permissions"
    );

    const result = employees.map((e) => ({
      _id: e.userId._id,
      username: e.userId.username,
      role: e.userId.role,
      permissions: e.userId.permissions,
      fullname: e.fullname,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================================
// POST /api/users  (Lab22 route yêu cầu có)
// Body: { user: {...}, employee: {...} }
// =======================================
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
      message: "Create successful user",
      user: newUser,
      employee: newEmployee,
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

// ======================================================
// PUT /api/users/:id
// - Hỗ trợ 2 kiểu body:
//   A) { user: {...}, employee: {...} }  -> update cả 2
//   B) { username, role, permissions, locked, email, password... } -> update User (Lab22)
// ======================================================
const updateUserEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const { user, employee, ...flatUserPatch } = req.body;

    // nested user (Lab21) hoặc flat (Lab22)
    const userPatch = user ?? flatUserPatch;
    const employeePatch = employee; // có thể undefined

    // validate
    if (userPatch.username !== undefined && !String(userPatch.username).trim()) {
      return res.json({ status: false, message: "Username cannot be empty" });
    }
    if (userPatch.email !== undefined && !String(userPatch.email).trim()) {
      return res.json({ status: false, message: "Email cannot be empty" });
    }
    if (employeePatch?.fullname !== undefined && !String(employeePatch.fullname).trim()) {
      return res.json({ status: false, message: "Fullname cannot be empty" });
    }

    // check trùng username/email
    if (userPatch.username) {
      const usernameExist = await User.findOne({
        username: userPatch.username,
        _id: { $ne: id },
      });
      if (usernameExist) return res.json({ status: false, message: "Username already exists" });
    }
    if (userPatch.email) {
      const emailExist = await User.findOne({
        email: userPatch.email,
        _id: { $ne: id },
      });
      if (emailExist) return res.json({ status: false, message: "Email already exists" });
    }

    // hash password nếu có
    if (userPatch.password) {
      const pw = String(userPatch.password);
      if (!pw.startsWith("$2a$") && !pw.startsWith("$2b$") && !pw.startsWith("$2y$")) {
        userPatch.password = await bcrypt.hash(pw, 10);
      }
    } else {
      delete userPatch.password;
    }

    // ✅ update user, trả doc sau update
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...userPatch, permissions: userPatch.permissions },
      { new: true } // findByIdAndUpdate vẫn OK; warning của bạn nằm ở findOneAndUpdate
    );

    // ✅ nếu không tìm thấy -> trả 404 cho chuẩn
    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    let updatedEmployee = null;

    // ✅ nếu có employeePatch thì update employee (dùng returnDocument:'after' để sạch warning)
    if (employeePatch) {
      updatedEmployee = await Employee.findOneAndUpdate(
        { userId: id },
        employeePatch,
        { returnDocument: "after" } // ✅ thay cho new:true (tránh warning)
      );
    }

    return res.json({
      status: true,
      message: "Update successful users",
      user: updatedUser,
      employee: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// ======================
// DELETE /api/users/:id
// ======================
const deleteUserEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findOneAndDelete({ userId: id });
    await User.findByIdAndDelete(id);

    res.json({ status: true, message: "Delete successful users" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getUsersPermission, // ✅ Lab22
  createUserEmployee,
  updateUserEmployee,
  deleteUserEmployee,
};