const capitalized = require("../utils/capitalized");
const axios = require("axios"); // make calls to external APIs
//import { capitalized } from "../utils/capitalized.js";
const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");
const Ingredient = require("../models/Ingredient.model");
const RecipeIngredient = require("../models/RecipeIngredient.model");
const Comment = require("../models/Comment.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");
const { Router } = require("express");
const fileUploader = require("../config/cloudinary.config");

// GET route - for create recipe form
router.get("/create", isLoggedIn, async (req, res) => {
  try {
    //  const loggedInNavigation = true;
    const { currentUser } = req.session;
    const ingredients = await Ingredient.find();
    console.log(`IngredientData: ${ingredients}`);
    res.render("recipe/create", { currentUser, ingredients });
  } catch (err) {
    console.error(err);
  }
});

// POST route - for submit recipe create form
router.post(
  "/create",
  isLoggedIn,
  fileUploader.single("recipe-cover-image"),
  async (req, res) => {
    try {
      const newRecipeInfo = req.body;
      const { _id } = req.session.currentUser;
      const { Ingredients } = req.body;
      const ingredientsObjs = JSON.parse(Ingredients);

      RecipeIngredient.create(ingredientsObjs)
        .then((result) => {
          return result.map((ingredient) => ingredient._id);
        })
        .then(async (ingredientsIds) => {
          if (!req.file) {
            const newRecipe = await Recipe.create({
              title: newRecipeInfo.title,
              cuisine: newRecipeInfo.cuisine,
              prepTime: newRecipeInfo.prepTime,
              cookTime: newRecipeInfo.cookTime,
              totalTime:
                Number(newRecipeInfo.cookTime) + Number(newRecipeInfo.prepTime),
              servings: newRecipeInfo.servings,
              instructions: newRecipeInfo.instructions,
              Ingredients: ingredientsIds,
              Owner: _id,
            });
            res.redirect("/auth/home");
          } else {
            const newRecipe = await Recipe.create({
              title: newRecipeInfo.title,
              cuisine: newRecipeInfo.cuisine,
              prepTime: newRecipeInfo.prepTime,
              cookTime: newRecipeInfo.cookTime,
              servings: newRecipeInfo.servings,
              totalTime:
                Number(newRecipeInfo.cookTime) + Number(newRecipeInfo.prepTime),
              instructions: newRecipeInfo.instructions,
              imageUrl: req.file.path,
              Ingredients: ingredientsIds,
              Owner: _id,
            });
            res.redirect("/auth/home");
          }
        });
    } catch (err) {
      console.error(err);
    }
  }
);

// GET route - for update recipe
router.get("/update/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const { currentUser } = req.session;

    // console.log(currentUser);
    const recipeToUpdate = await Recipe.findById(id);
    res.render("recipe/update", { recipeToUpdate, currentUser });
  } catch (err) {
    console.error(err);
  }
});

// POST route - for submit update form
router.post(
  "/update/:id",
  isLoggedIn,
  fileUploader.single("recipe-cover-image"),
  async (req, res) => {
    try {
      console.log("req.body", req.body);
      const { id } = req.params;
      const {
        title,
        cuisine,
        prepTime,
        cookTime,
        servings,
        instructions,
        existingImage,
      } = req.body;

      let imageUrl;
      if (req.file) {
        imageUrl = req.file.path;
      } else {
        imageUrl = existingImage;
      }

      await Recipe.findByIdAndUpdate(
        id,
        {
          title,
          cuisine,
          prepTime,
          cookTime,
          servings,
          instructions,
          imageUrl,
        },
        { new: true }
      );

      res.redirect("/auth/home");
    } catch (err) {
      console.error(err);
    }
  }
);

// POST route - for delete recipe
router.post("/delete/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    await Recipe.findByIdAndDelete(id);
    res.redirect("/auth/home");
  } catch (err) {
    console.log(err);
  }
});

// GET route - for list all recipe
router.get("/list", async (req, res) => {
  try {
    const { currentUser } = req.session;
    const allRecipes = await Recipe.find();
    res.render("recipe/list", { allRecipes, currentUser });
  } catch (err) {
    console.log(err);
  }
});

router.get("/details/:id", async (req, res) => {
  try {
    const { currentUser } = req.session;
    const { id } = req.params;

    const searchedRecipe = await Recipe.findById(id)
      .populate("Owner comments Ingredients")
      .populate({
        // we are populating author in the previously populated comments
        path: "comments",
        populate: {
          path: "author",
          model: "User",
        },
      });

    let ingredientIds = [];

    for (let i = 0; i < searchedRecipe.Ingredients.length; i++) {
      ingredientIds.push(searchedRecipe.Ingredients[i].id);
    }

    const ingredients = await Ingredient.find({ id: { $in: ingredientIds } });

    const recipeNutrient = {
      servings: searchedRecipe.servings,
      calories: 0,
      totalFat: {
        totalFat: 0,
        saturatedFat: 0,
        transFat: 0,
      },
      totalCarbohydrate: {
        totalCarbohydrate: 0,
        dietaryFiber: 0,
        sugars: 0,
      },
      protein: 0,
    };

    for (let i = 0; i < ingredients.length; i++) {
      let ingredientQuantity = searchedRecipe.Ingredients[i].quantity;
      let nutrients = ingredients[i].nutrients;
      let servingSize = ingredients[i].servingSize;
      recipeNutrient.calories += calculateNutrientAmount(
        servingSize,
        ingredientQuantity,
        nutrients.calories
      );
      recipeNutrient.totalFat.totalFat += calculateNutrientAmount(
        servingSize,
        ingredientQuantity,
        nutrients.totalFat.totalFat
      );
      recipeNutrient.totalFat.saturatedFat += calculateNutrientAmount(
        servingSize,
        ingredientQuantity,
        nutrients.totalFat.saturatedFat
      );
      recipeNutrient.totalFat.transFat += calculateNutrientAmount(
        servingSize,
        ingredientQuantity,
        nutrients.totalFat.transFat
      );
      recipeNutrient.totalCarbohydrate.totalCarbohydrate +=
        calculateNutrientAmount(
          servingSize,
          ingredientQuantity,
          nutrients.totalCarbohydrate.totalCarbohydrate
        );
      recipeNutrient.totalCarbohydrate.dietaryFiber += calculateNutrientAmount(
        servingSize,
        ingredientQuantity,
        nutrients.totalCarbohydrate.dietaryFiber
      );
      recipeNutrient.totalCarbohydrate.sugars += calculateNutrientAmount(
        servingSize,
        ingredientQuantity,
        nutrients.totalCarbohydrate.sugars
      );
      recipeNutrient.protein += calculateNutrientAmount(
        servingSize,
        ingredientQuantity,
        nutrients.protein
      );
    }
    console.log(recipeNutrient);
    res.render("recipe/details", {
      searchedRecipe,
      recipeNutrient,
      currentUser,
    });
  } catch (err) {
    console.log(err);
  }
});

function calculateNutrientAmount(servingSize, quantity, foodNutrientAmount) {
  let foodNutrientSingleAmount = foodNutrientAmount / servingSize;
  return foodNutrientSingleAmount * quantity;
}

async function getIngredientsData(id) {
  try {
    let res = await axios({
      url: `https://api.nal.usda.gov/fdc/v1/foods?fdcIds=${id}&nutrients=203,208,269,291,307,601,605,606&api_key=6htf03n46hsW3piW88qt8gDIpAha0ewMtWfshMqC`,
      method: "get",
      timeout: 8000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status == 200) {
      // test for status you want, etc
      console.log(res.status);
    }
    // Don't forget to return something
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

module.exports = router;
