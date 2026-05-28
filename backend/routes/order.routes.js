const express = require("express");
const router = express.Router();
const Order = require("../models/order");

const {
  updateOrderStatus,
  deleteOrder
} = require("../controllers/order.controller");


// ================= CREATE ORDER =================
router.post("/", async (req, res) => {

  try {

    const {
      ownerId,
      customerName,
      orderItems,
      address,
      phone,
      email,
      shippingFee = 0
    } = req.body;

    const newOrder = new Order({
      ownerId,
      customerName,
      orderItems,
      address,
      phone,
      email,
      shippingFee
    });

    const saved = await newOrder.save();

    res.json({
      status: true,
      data: saved
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      message: error.message
    });

  }

});


// ================= GET ALL ORDERS =================
router.get("/", async (req, res) => {

  try {

    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      status: true,
      data: orders
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      message: error.message
    });

  }

});


// ================= GET ORDERS BY USER =================
router.get("/user/:userId", async (req, res) => {

  try {

    const orders = await Order.find({
      ownerId: req.params.userId
    }).sort({ createdAt: -1 });

    res.json({
      status: true,
      data: orders
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      message: error.message
    });

  }

});


// ================= UPDATE STATUS =================
router.put("/:id/status", updateOrderStatus);


// ================= DELETE ORDER =================
router.delete("/:id", deleteOrder);


// ================= GET SINGLE ORDER =================
router.get("/:id", async (req, res) => {

  try {

    const order = await Order.findById(req.params.id);

    res.json({
      status: true,
      data: order
    });

  } catch (error) {

    res.status(500).json({
      status: false,
      message: error.message
    });

  }

});

module.exports = router;