const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "First name is required"],
        trim: true, 
        minlength: [2, "First name must be at least 2 characters long"],
        maxlength: [50, "First name cannot exceed 50 characters"],
        match: [/^[A-Za-z]+$/, "First name must contain only alphabets"]
    },
    lastname: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minlength: [2, "Last name must be at least 2 characters long"],
        maxlength: [50, "Last name cannot exceed 50 characters"],
        match: [/^[A-Za-z]+$/, "First name must contain only alphabets"]
    },  
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true, 
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email address"
        ]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    problemsSolved: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 1200,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },   
    }, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model("User", userSchema);