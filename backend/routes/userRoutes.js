const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const { authenticate }= require("../middlewares/authenticate"); // called destructing

//Route to get profile of currently logged-in user- will be written here only
//bcoz to get all user info is here only
router.get("/me", authenticate, userController.getLoggedInUser);

// CRUD routes for single user
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUserById);
router.delete("/:id", userController.deleteUserById);

module.exports = router;
