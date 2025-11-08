const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  customerName: {
    type: String,
    required: true,
  },
  tableNumber: {
    type: String,
    required: true,
  },
  orderItems: [
    {
      name: String,
      quantity: Number,
      price: Number,
      selectedOption: String,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('order', OrderSchema);