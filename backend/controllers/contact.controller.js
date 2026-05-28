const Contact = require("../models/contact.model");


// khách gửi liên hệ
exports.createContact = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    const contact = new Contact({
      name,
      phone,
      email,
      message,
    });

    await contact.save();

    res.json({
      status: true,
      message: "Gửi liên hệ thành công",
      data: contact,
    });

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


// admin xem danh sách
exports.getContacts = async (req, res) => {
  try {

    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.json({
      status: true,
      data: contacts
    });

  } catch (error) {
    res.status(500).json({
      status:false,
      message:error.message
    });
  }
};


// admin trả lời
exports.replyContact = async (req, res) => {
  try {

    const { reply } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        reply,
        status:"replied"
      },
      { new:true }
    );

    res.json({
      status:true,
      message:"Đã phản hồi",
      data:contact
    });

  } catch (error) {

    res.status(500).json({
      status:false,
      message:error.message
    });

  }
};