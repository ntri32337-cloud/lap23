// backend/controllers/auth.controller.js
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      permissions: user.permissions,
      locked: user.locked,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ message: "Email hoặc username đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ mặc định customer nếu bạn muốn register từ Signup
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "customer",
      permissions: ["view"],
      locked: false,
    });

    const token = generateToken(user);
    return res.status(201).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        locked: user.locked,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) return res.json({ status: false, message: "Username are required" });
    if (!password) return res.json({ status: false, message: "Password are required" });
    if (password.length < 6)
      return res.json({ status: false, message: "Password must be at least 6 characters" });

    const user = await User.findOne({ username });
    if (!user) return res.json({ status: false, message: "User not found" });
    if (user.locked)
      return res.json({
        status: false,
        message: "Your account has been locked. Please contact the administrator.",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ status: false, message: "Incorrect password" });

    const token = generateToken(user);

    return res.json({
      status: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        permissions: user.permissions,
        locked: user.locked,
        email: user.email,
      },
    });
  } catch (error) {
    return res.json({ status: false, message: "Internal server error" });
  }
};

module.exports = { login, register };