const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// @route   POST /api/feedback
// @desc    Save new feedback
router.post('/', async (req, res) => {
  const newFeedback = new Feedback({
    feedbackText: req.body.feedbackText,
  });

  try {
    await newFeedback.save();
    res.status(201).json({ success: true, message: 'Feedback submitted successfully!' });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error submitting feedback.' });
  }
});

module.exports = router;