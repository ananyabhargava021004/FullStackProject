const Contest = require("../models/Contest");
const Problem = require("../models/Problem");

exports.createContest = async (req, res) => {
  try {
    const { name, problemIds, startTime, endTime } = req.body;
    const contest = await Contest.create({ name, problems: problemIds, startTime, endTime });
    res.status(201).json(contest);
  } catch (err) {
    res.status(500).json({ error: "Failed to create contest" });
  }
};

exports.getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find().populate("problems");
    res.json(contests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contests" });
  }
};

exports.getContestById = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id).populate("problems");
    if (!contest) return res.status(404).json({ error: "Contest not found" });
    res.json(contest);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contest" });
  }
};

exports.updateContest = async (req, res) => {
  try {
    const { name, startTime, endTime, problems } = req.body;
    const updated = await Contest.findByIdAndUpdate(
      req.params.id,
      { name, startTime, endTime, problems },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Contest not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update contest" });
  }
};

exports.deleteContest = async (req, res) => {
  try {
    const deleted = await Contest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Contest not found" });
    res.json({ message: "Contest deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete contest" });
  }
};
