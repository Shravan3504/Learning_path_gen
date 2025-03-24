const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  skillLevel: {
    type: String,
    required: true
  },
  roadmap: {
    type: String, // You can store the roadmap as a JSON string
    required: true
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
