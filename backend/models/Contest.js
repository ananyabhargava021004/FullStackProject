const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema({
  name: String,
  startTime: Date,
  endTime: Date,
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
});

module.exports = mongoose.model("Contest", contestSchema);
