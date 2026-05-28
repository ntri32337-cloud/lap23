const Order = require("../models/order");

// ================= CREATE ORDER =================
const createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice, address, phone, email, customerName, ownerId } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Order items empty",
      });
    }

    const order = await Order.create({
      ownerId,
      customerName: customerName || "Guest",
      orderItems,
      totalPrice: Number(totalPrice || 0),
      address: address || "",
      phone: phone || "",
      email: email || "",
      status: "pending",
    });

    return res.json({
      status: true,
      message: "Order created",
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ================= GET ALL ORDERS (ADMIN) =================
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.json({
      status: true,
      data: orders,
    });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Lỗi lấy danh sách",
    });
  }
};

// ================= GET MY ORDERS (CUSTOMER) =================
const getMyOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ ownerId: userId }).sort({ createdAt: -1 });

    return res.json({
      status: true,
      data: orders,
    });
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// ================= UPDATE STATUS =================
// UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    res.json({
      status: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
// ================= DELETE ORDER =================
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await Order.findByIdAndDelete(id);

    res.json({
      status: true,
      message: "Order deleted",
    });
  } catch (error) {
    console.error("DELETE ORDER ERROR:", error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
  deleteOrder,
};