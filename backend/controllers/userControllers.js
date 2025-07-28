const User = require("../models/User");

// Get user profile by id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

// Update user by id
exports.updateUserById = async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstname, lastname, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

// Delete user by id
exports.deleteUserById = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

// fetch logged in user profile
exports.getLoggedInUser = async (req,res) => {
  try {
    if(req.user.role === "admin"){
      return res.status(200).json({
        success: true,
        user : {
          firstname: "Admin",
          lastname:  "Account",
          email: process.env.ADMIN_EMAIL,
          role: "admin",
          problemSolved: 0,
          rating: 1500
        }
      });
    }
    // for normal users
    const user= await User.findById(req.user.id).select("-password");
    if(!user){
      return res.status(404).json({success: false, message: "User not found"});
    }
    res.status(200).json({ success: true, user });
  } catch(error){
    res.status(500).json({message: "Error fetching user" });
  }
};
