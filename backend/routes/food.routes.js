const express = require("express");
const {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} = require("../controllers/food.controller");

const router = express.Router();

router.get("/", getAllFoods);
router.get("/:id", getFoodById);
router.post("/", createFood);
router.put("/:id", updateFood);
router.delete("/:id", deleteFood);

module.exports = router;