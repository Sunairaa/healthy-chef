const { Schema, model } = require("mongoose");

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      //   required: [true, "Recipe title is required."],
    },
    cuisine: {
      type: String,
      // required: true
    },
    prepTime: {
      type: Number,
      min: 0,
    },
    cookTime: {
      type: Number,
      min: 0,
    },
    servings: {
      type: Number,
      min: 0,
    },
    instructions: {
      type: String,
    },
    Ingredients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe_Ingredient",
      },
    ],
    imageUrl: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1598515211932-b130a728a769?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
    },
    Owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    healthRating: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
