const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const DBConnection = async () => {
    const MONGO_URI = process.env.MONGODB_URL; // yes
    try {
        await mongoose.connect(MONGO_URI); // to connect with mongodb
        console.log("DataBase connection established");
    } catch (error) {
        console.log("Error while connecting to MongoDB", error);
        process.exit(1);
    }
};

module.exports = {DBConnection};