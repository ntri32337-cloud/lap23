const Food = require("../models/food");

// GET /api/foods
const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find().populate("category", "name image");
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/foods/:id
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food không tồn tại" });
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/foods
const createFood = async (req, res) => {
  try {
    const newFood = new Food(req.body);
    const savedFood = await newFood.save();
    res.json({ status: true, message: "Create successful food", savedFood });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

// PUT /api/foods/:id
const updateFood = async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedFood)
      return res.status(404).json({ message: "Food không tồn tại" });
    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/foods/:id
const deleteFood = async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood)
      return res.status(404).json({ message: "Food không tồn tại" });
    res.status(200).json({ message: "Xóa food thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
};