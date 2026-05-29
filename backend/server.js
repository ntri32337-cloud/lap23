const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();

// 🔥 CORS FIX - CHO PHÉP REACT (5173/3000) gọi API
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "https://nvamart.vercel.app" // Thêm tên miền mới của ông vào đây
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 🔥 BODY PARSER - XỬ LÝ JSON + FORM DATA
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 🔥 TEST ENDPOINTS
app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "🍕 Food API is running perfectly!",
    timestamp: new Date().toISOString(),
    endpoints: {
      orders: "/api/orders (POST)",
      test: "/api/test"
    }
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    status: true,
    message: "✅ Backend connection OK!",
    serverTime: new Date().toISOString()
  });
});

// 🔥 IMPORT ROUTES (GIỮ NGUYÊN)
const foodRoutes = require("./routes/food.routes");
const categoryRoutes = require("./routes/category.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const employeeRoutes = require("./routes/employee.routes");
const customerRoutes = require("./routes/customer.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const contactRoutes = require("./routes/contact.routes");

// 🔥 USE ROUTES (GIỮ NGUYÊN)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contacts", contactRoutes);

// 🔥 ERROR HANDLING - LOG CHI TIẾT
app.use((err, req, res, next) => {
  console.error("💥 GLOBAL ERROR:", err.stack);
  res.status(500).json({
    status: false,
    message: "Server error",
    ...(process.env.NODE_ENV === "development" && { error: err.message })
  });
});

// 🔥 404 HANDLER (GIỮ NGUYÊN)
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// 🔥 MONGOOSE CONNECTION - VỚI RETRY
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

// 🔥 SERVER START
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📱 Test ngay: http://localhost:${PORT}/api/test`);
  console.log(`🔗 CORS enabled for: localhost:5173, localhost:3000`);
});

// 🔥 GRACEFUL SHUTDOWN
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received, shutting down gracefully");
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log("✅ MongoDB disconnected");
      process.exit(0);
    });
  });
});