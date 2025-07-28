const express = require('express');
const router = express.Router();
const { generateAIFields } = require('../controllers/aiController');

router.post('/generate', generateAIFields);

module.exports = router;
