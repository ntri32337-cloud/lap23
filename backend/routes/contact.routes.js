const express = require("express");
const router = express.Router();

const {
  createContact,
  getContacts,
  replyContact
} = require("../controllers/contact.controller");

router.post("/", createContact);
router.get("/", getContacts);
router.put("/:id", replyContact);

module.exports = router;