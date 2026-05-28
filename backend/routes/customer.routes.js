// backend/routes/customer.route.js
const router = require("express").Router();
const ctrl = require("../controllers/customer.controller");

router.get("/", ctrl.getCustomers);
router.post("/", ctrl.createCustomer);
router.put("/:id", ctrl.updateCustomer);
router.delete("/:id", ctrl.deleteCustomer);

module.exports = router;