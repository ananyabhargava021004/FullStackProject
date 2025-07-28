const Problem = require('../models/Problem');
const { scoreAIQuality } = require('../utils/aiQualityScorer');
const { generateExample } = require('../utils/aiGenerator');

// @desc    Get all problems
// @route   GET /api/problems
// @access  Public
exports.getAllProblems = async (req, res) => {
  try {
    // GET /api/problems?search=sort&tags=array,string&difficulty=Easy
    // takes query and assigns them to variables
    const { search, tags, difficulty }= req.query;
    const query = {};
     // If search string present → regex search on title (case insensitive)
    if(search){
        query.title={ $regex:search, $options:"i"};
    }
    // If tags present → match any of the tags
    if (tags) {
      query.tags = { $in: tags.split(",") };
    }
    // If difficulty filter present → exact match
    if (difficulty) {
      query.difficulty = difficulty;
    }
    // Fetch problems from DB with built query
    const problems = await Problem.find(query);
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching problems", error: error.message });
  }
};

// @desc    Get a problem by ID
// @route   GET /api/problems/:id
// @access  Public
exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.status(200).json(problem);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching problem', error: err.message });
  }
};

// @desc    Create new problem (Admin)
// @route   POST /api/problems/create
// @access  Admin
exports.createProblem = async (req, res) => {
  try {
    const autoGen = generateExample(req.body.description);
    const aiQuality = scoreAIQuality(req.body);
    const newProblem = new Problem({ ...req.body, ...autoGen, aiQuality });
    await newProblem.save();
    res.status(201).json({ message: "Problem created", problem: newProblem });
  } catch (err) {
    res.status(500).json({ message: "Problem creation failed", error: err.message });
  }
};

// @desc    Update existing problem (Admin)
// @route   PUT /api/problems/:id
// @access  Admin
exports.updateProblem = async (req, res) => {
  try {
    const autoGen = generateExample(req.body.description);
    const aiQuality = scoreAIQuality(req.body);
    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ...autoGen, aiQuality},
      { new: true, runValidators: true }
    );
    if (!updatedProblem) return res.status(404).json({ message: "Problem not found" });
    res.status(200).json({ message: "Problem updated", problem: updatedProblem });
  } catch (err) {
    res.status(500).json({ message: "Problem update failed", error: err.message });
  }
};

// @desc    Delete a problem (Admin)
// @route   DELETE /api/problems/:id
// @access  Admin
exports.deleteProblem = async (req, res) => {
  try {
    const deleted = await Problem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Problem not found" });
    res.status(200).json({ message: "Problem deleted" });
  } catch (err) {
    res.status(500).json({ message: "Problem deletion failed", error: err.message });
  }
};
