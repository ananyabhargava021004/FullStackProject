const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  constraints: {
    type: String,
    required: true
  },
  sampleInput: {
    type: String,
    required : false
  },
  sampleOutput: {
    type: String,
    required : false
  },
  testCases: [
    {
      input: String,
      output: String
    }
  ],
  tags: [String],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  aiQuality: {
    type: Number,
    default: 5
  },
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
