// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Normalize để code Lab23 dùng req.user._id chạy đúng
    req.user = {
      ...decoded,
      _id: decoded._id || decoded.id,
      id: decoded.id || decoded._id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Invalid token",
    });
  }
};

module.exports = auth;