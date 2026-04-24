// =============================================
// middleware/auth.js - JWT Auth Middleware
// =============================================

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get token from Authorization header: "Bearer <token>"
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // attach admin info to request
    next(); // proceed to next middleware/route
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
