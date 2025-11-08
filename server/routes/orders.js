const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @route   POST /api/orders
// @desc    Create a new order
router.post('/', async (req, res) => {
  const newOrder = new Order({
    customerName: req.body.customerName,
    tableNumber: req.body.tableNumber,
    orderItems: req.body.orderItems,
    totalAmount: req.body.totalAmount,
  });

  try {
    const order = await newOrder.save();
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Error saving order' });
  }
});

module.exports = router;