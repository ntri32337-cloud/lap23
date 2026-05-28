// backend/routes/employee.route.js
const express = require("express");
const router = express.Router();
const {
  getAllEmployee,
  createUserEmployee,
  updateUserEmployee,
  deleteUserEmployee,
} = require("../controllers/employee.controller");

router.get("/", getAllEmployee);
router.post("/", createUserEmployee);
router.put("/:id", updateUserEmployee);
router.delete("/:id", deleteUserEmployee);

module.exports = router;