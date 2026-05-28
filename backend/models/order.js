const mongoose = require("mongoose");

// 🛒 OrderItem Schema
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
    required: [true, "Sản phẩm bắt buộc"]
  },
  name: {
    type: String,
    required: [true, "Tên sản phẩm bắt buộc"],
    trim: true,
    maxlength: [100]
  },
  price: {
    type: Number,
    required: [true, "Giá bắt buộc"],
    min: [0]
  },
  quantity: {
    type: Number,
    required: [true, "Số lượng bắt buộc"],
    min: [1],
    max: [100]
  },
  image: {
    type: String,
    default: ""
  }
}, { _id: false });

// 🧾 Order Schema
const orderSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Khách hàng bắt buộc"],
    index: true
  },
  customerName: {  // ✅ Dashboard
    type: String,
    required: [true, "Tên khách hàng bắt buộc"],
    trim: true
  },
  orderItems: {
    type: [orderItemSchema],
    required: [true, "Phải có sản phẩm"],
    validate: {
      validator: v => v && v.length > 0,
      message: "Đơn hàng phải có sản phẩm"
    }
  },
  totalPrice: {
    type: Number,
    required: [true, "Tổng tiền bắt buộc"],
    min: [0],
    default: 0
  },
  shippingFee: {
    type: Number,
    default: 0,
    min: 0
  },
  address: {
    type: String,
    required: [true, "Địa chỉ bắt buộc"],
    trim: true
  },
  phone: {
    type: String,
    required: [true, "Số điện thoại bắt buộc"],
    trim: true,
    match: [/^\d{10,11}$/]
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "transfer"],
    default: "cash"
  },
  note: String
}, {
  timestamps: true
});

// 🔥 VIRTUALS
orderSchema.virtual("subtotal").get(function() {
  return this.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

// 🔥 INDEXES
orderSchema.index({ ownerId: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ customerName: 1 });

// 🔥 MIDDLEWARE SAVE - FIX "next is not a function"
orderSchema.pre("save", function() {  // ✅ Không dùng next
  if (this.orderItems?.length) {
    this.totalPrice = this.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );
  }
});

// 🔥 QUERY POPULATE
orderSchema.pre(/^find/, function() {
  this.populate({
    path: "orderItems.productId",
    select: "name price image"
  });
});

// 🔥 CLEAN JSON
orderSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("Order", orderSchema, "orders");