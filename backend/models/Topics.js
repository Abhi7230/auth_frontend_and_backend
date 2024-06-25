// models/Topics.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TopicSchema = new Schema({
  topic: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Topic', TopicSchema);
