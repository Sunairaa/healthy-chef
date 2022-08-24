const { Schema, model } = require("mongoose");

const recipeIngredientSchema = new Schema(
  {
    id: {
        type: String
    },
    name: {
        type: String
    },
    quantity: {
        type: String,
        min: 1
    }
  },
  {
    timestamps: true,
  }
);

const RecipeIngredient = model("RecipeIngredient", recipeIngredientSchema);

module.exports = RecipeIngredient;
