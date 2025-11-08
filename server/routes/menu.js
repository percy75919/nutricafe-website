const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// This route gets ALL menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// This is the route for your specials page
router.get('/specials', async (req, res) => {
  try {
    const specialItems = await MenuItem.find({ isSpecial: true });
    res.json(specialItems);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// This route adds a new item
router.post('/', async (req, res) => {
  const newItem = new MenuItem(req.body);
  try {
    const item = await newItem.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Error creating item' });
  }
});

// This line is essential for the routes to work
module.exports = router;