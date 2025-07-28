const express = require("express");
const router = express.Router();
const { authenticate, authorizeAdmin } = require("../middlewares/authenticate");
const {
  getAllProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem
} = require("../controllers/problemController");

// GET all problems
router.get("/", getAllProblems);

// GET a problem by ID
router.get("/:id", getProblemById);

// ADMIN only
router.post("/create", authenticate, authorizeAdmin, createProblem);
router.put("/:id", authenticate, authorizeAdmin, updateProblem);
router.delete("/:id", authenticate, authorizeAdmin, deleteProblem);

module.exports = router;
