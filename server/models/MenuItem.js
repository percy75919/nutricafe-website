const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NutritionSchema = new Schema({
  calories: { type: Number },
  protein: { type: String },
  carbs: { type: String },
  fat: { type: String }
}, { _id: false });

const MenuItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, required: true },
  price: { type: Schema.Types.Mixed, required: true },
  imageUrl: { type: String, default: '' },
  nutrition: { type: NutritionSchema },
  tags: { type: [String], default: [] },
  isSpecial: { type: Boolean, default: false }
});

module.exports = mongoose.model('menuItem', MenuItemSchema);