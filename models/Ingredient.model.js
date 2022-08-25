const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredientSchema = new Schema(
{
  id:  { type: String, required: true, unique: true },
  title: String,
  servingSize: Number,
  servingSizeUnit: String,
  nutrients: Object ,
},
{ timestamps: true }
);

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;