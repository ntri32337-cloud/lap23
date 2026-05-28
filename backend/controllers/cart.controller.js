// backend/controllers/cart.controller.js
const Cart = require("../models/cart");

const addToCart = async (req, res) => {
  try {
    const { ownerId, ownerType, product } = req.body;

    if (!ownerId || !ownerType || !product?.productId) {
      return res.status(400).json({
        status: false,
        message: "Missing ownerId / ownerType / product",
      });
    }

    let cart = await Cart.findOne({ ownerId, ownerType });

    if (!cart) {
      cart = new Cart({
        ownerId,
        ownerType,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === String(product.productId)
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(product.quantity || 1);
    } else {
      cart.items.push({
        productId: product.productId,
        name: product.name,
        image: product.image,
        price: Number(product.price || 0),
        quantity: Number(product.quantity || 1),
        selected: false,
      });
    }

    await cart.save();
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const cart = await Cart.findOne({ ownerId });

    if (!cart) {
      return res.json({
        ownerId,
        items: [],
      });
    }

    return res.json(cart);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updateSelected = async (req, res) => {
  try {
    const { ownerId, productId, selected } = req.body;
    const cart = await Cart.findOne({ ownerId });

    if (!cart) {
      return res.status(404).json({
        status: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (i) => i.productId.toString() === String(productId)
    );

    if (!item) {
      return res.status(404).json({
        status: false,
        message: "Item not found",
      });
    }

    item.selected = !!selected;
    await cart.save();
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { ownerId, productId, quantity } = req.body;
    const cart = await Cart.findOne({ ownerId });

    if (!cart) {
      return res.status(404).json({
        status: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (i) => i.productId.toString() === String(productId)
    );

    if (!item) {
      return res.status(404).json({
        status: false,
        message: "Item not found",
      });
    }

    item.quantity = Math.max(1, Number(quantity || 1));
    await cart.save();
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const removeItem = async (req, res) => {
  try {
    const { ownerId, productId } = req.body;
    const cart = await Cart.findOne({ ownerId });

    if (!cart) {
      return res.status(404).json({
        status: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== String(productId)
    );

    await cart.save();
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cartId);

    if (!cart) {
      return res.status(404).json({
        status: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    await cart.save();
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deleteSelectedCart = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const cart = await Cart.findOneAndUpdate(
      { ownerId },
      {
        $pull: {
          items: { selected: true },
        },
      },
      { returnDocument: "after" }
    );

    return res.json({
      status: true,
      message: "Removed selected items",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateQuantity,
  updateSelected,
  deleteSelectedCart,
  removeItem,
  clearCart,
};