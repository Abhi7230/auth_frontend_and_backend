// models/Problems.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProblemSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  problem_statement: {
    type: String,
    required: true
  },
  input_description: {
    type: String,
    required: true
  },
  output_description: {
    type: String,
    required: true
  },
  sample_cases: [{
    sample_input: {
      type: String,
      required: true
    },
    sample_output: {
      type: String,
      required: true
    }
  }],
  constraints: {
    type: String,
    required: true
  },
  hints: [{
    hints: {
      type: String,
      required: true
    }
  }],
  topics: [{
    type: Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  }],
  locked_test_cases: [{
    input: {
      type: String,
      required: true
    },
    output: {
      type: String,
      required: true
    }
  }],
  admin_solution: {
    code: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true
    }
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated_at: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = mongoose.model('Problem', ProblemSchema);
