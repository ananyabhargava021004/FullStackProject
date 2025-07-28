const mongoose = require("mongoose");
const Submission = require("../models/Submission");
const Contest = require("../models/Contest");
const User = require("../models/User");

/**
 * Submit a solution (POST /api/submissions)
 */
exports.submitSolution = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const userId = req.user?.id;

    // ✅ Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const newSubmission = new Submission({
      user: userId,
      problem: problemId,
      code,
      language,
      verdict: "Accepted"
    });

    await newSubmission.save();

    const user = await User.findById(userId);
    if (user) {
      // 🔧 Fixed typo
      user.problemsSolved = (user.problemsSolved || 0) + 1;
      user.rating = (user.rating || 0) + 10;
      await user.save();
    }

    res.status(201).json({
      message: "Solution submitted successfully!",
      submission: newSubmission,
      problemsSolved: user?.problemsSolved || 0,
      rating: user?.rating || 0,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error submitting solution", error: error.message });
  }
};

/**
 * Get all submissions by current user (GET /api/submissions)
 */
exports.getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const submissions = await Submission.find({ user: userId }).populate(
      "problem"
    );

    res.status(200).json(submissions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch submissions", error: error.message });
  }
};

/**
 * Get all submissions for a contest (GET /api/submissions/:contestId)
 */
exports.getSubmissionsByContest = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { contestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({ message: "Invalid contest ID" });
    }

    const contest = await Contest.findById(contestId).populate("problems");
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    const submissions = await Submission.find({
      user: userId,
      problem: { $in: contest.problems.map((p) => p._id) },
      createdAt: {
        $gte: new Date(contest.startTime),
        $lte: new Date(contest.endTime),
      },
    })
      .populate("problem")
      .sort({ createdAt: -1 });

    res.status(200).json(submissions);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching contest submissions", error: err.message });
  }
};
