const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/User");
const nodemailer = require("nodemailer");

exports.signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!(firstname && lastname && email && password)) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(firstname) || !nameRegex.test(lastname)) {
      return res.status(400).json({ success: false, message: "First and last name must contain only alphabets" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: "user"
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role:user.role },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: { id: user._id, firstname, lastname, email },
      token
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Internal server error during signup" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password,role } = req.body;

    //hard coded the admin credentials
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
      const token = jwt.sign(
        { id: 'hardcodedAdminId', role: 'admin' },
        process.env.SECRET_KEY,
        { expiresIn: '5d'}
      );
      return res.status(200).json({
        success:true,
        message:"Welcome, Admin!",
        token,
        role: 'admin'
      });
    }

    if (!(email && password)) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, email: user.email,role:user.role },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.firstname}`,
      user: { id: user._id, firstname: user.firstname, lastname: user.lastname, email },
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error during login" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token").status(200).json({ success: true, message: "Logged out successfully" });
};

exports.getMe = async (req, res) => {
  try {
    if(req.user.role === "admin"){
      return res.status(200).json({
        success: true,
        user: {
          firstname : "Admin",
          lastname: "Account",
          email: process.env.ADMIN_EMAIL,
          role: "admin",
          problemsSolved: 0,
          rating:1500
        }
      });
    }
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "Email not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "15m" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="http://localhost:3000/reset-password/${resetToken}">here</a> to reset your password. Link valid for 15 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Password reset email sent!" });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Error sending reset email" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully!" });

  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid or expired token" });
  }
};
