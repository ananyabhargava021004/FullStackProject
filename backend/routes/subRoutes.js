const express = require('express');
const router = express.Router(); // create a new router object
const { submitSolution, getUserSubmissions } = require('../controllers/subController');
const { authenticate }= require('../middlewares/authenticate');
const { getSubmissionsByContest } = require('../controllers/subController');
// Import the authentication middleware to protect routes

/**
 * @route   POST /api/submissions/submit
 * @desc    Submit a new solution for a problem
 * @access  Private (Requires authentication)
 */
// → When a POST request is made to '/submit', first run 'authenticate' middleware then submitsolution controller function
router.post('/submit', authenticate, submitSolution);


/**
 * @route   GET /api/submissions/my-submissions
 * @desc    Fetch all submissions made by the logged-in user
 * @access  Private (Requires authentication)
 */

router.get('/my-submissions', authenticate, getUserSubmissions);

// GET submissions made by logged-in user for a given contest during contest window
router.get('/contest/:contestId', authenticate, getSubmissionsByContest);
module.exports = router;
