// backend/routes/cart.route.js
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const auth = require("../middleware/auth");

router.get("/:ownerId", cartController.getCart);
router.post("/add", cartController.addToCart);
router.put("/update", cartController.updateQuantity);
router.put("/updateSelected", cartController.updateSelected);
router.delete("/remove", cartController.removeItem);
router.delete("/clear/:cartId", cartController.clearCart);
router.put("/deleteSelectedCart", auth, cartController.deleteSelectedCart);

module.exports = router;