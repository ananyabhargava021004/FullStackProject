const express = require("express");
const router = express.Router();
const { authenticate, authorizeAdmin } = require("../middlewares/authenticate");
const authController = require("../controllers/authController");

// Auth API routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/me", authenticate, authController.getMe);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
