const jwt = require("jsonwebtoken");

// Authentication middleware to protect routes
const authenticate = (req, res, next) => {
  try {
    // Check token in cookies or Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach user data from token to request object
    req.user = decoded;
    next();
    
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token" });
  }
};

// Role-based authorization middleware (to protect admin routes)
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden: Admins only" });
  }
  next();
};

module.exports = { authenticate, authorizeAdmin };
