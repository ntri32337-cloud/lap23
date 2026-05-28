// backend/routes/user.route.js
const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUsersPermission,
  createUserEmployee,
  updateUserEmployee,
  deleteUserEmployee,
} = require("../controllers/user.controller");

router.get("/", getUsers);
router.get("/permissions", getUsersPermission); // ✅ Lab22
router.post("/", createUserEmployee);
router.put("/:id", updateUserEmployee);
router.delete("/:id", deleteUserEmployee);

module.exports = router;