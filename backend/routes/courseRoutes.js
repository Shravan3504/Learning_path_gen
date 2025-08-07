// courseRoutes.js
const express = require('express');
const router = express.Router();
const Course = require('../models/course');

// POST endpoint to save course data
router.post('/save-course', async (req, res) => {
  const { username, courseName, skillLevel, roadmap } = req.body;

  try {
    const newCourse = new Course({ username, courseName, skillLevel, roadmap });
    await newCourse.save();
    res.status(201).json({ message: 'Course saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET endpoint to fetch courses by username
router.get('/get-courses/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const courses = await Course.find({ username }); // Find courses by username
    if (courses.length === 0) {
      return res.status(404).json({ message: 'No courses found for this username' });
    }
    res.status(200).json(courses); // Return courses
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Add this to courseRoutes.js
router.delete('/delete-course/:username/:courseName', async (req, res) => {
  const { username, courseName } = req.params;

  try {
    const deletedCourse = await Course.findOneAndDelete({ 
      username: username,
      courseName: courseName 
    });

    if (!deletedCourse) {
      return res.status(404).json({ 
        message: 'Course not found' 
      });
    }

    res.status(200).json({ 
      message: 'Course deleted successfully',
      deletedCourse 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// GET endpoint to fetch a specific course by username and course name
router.get('/get-course/:username/:courseName', async (req, res) => {
  const { username, courseName } = req.params;
  
  try {
    const course = await Course.findOne({ 
      username: username, 
      courseName: { $regex: new RegExp(courseName.replace(/-/g, ' '), 'i') }
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});





module.exports = router;
