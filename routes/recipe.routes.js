const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");

const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");
const { Router } = require("express");
const async = require("hbs/lib/async");

// ********* require fileUploader in order to use it *********
const fileUploader = require('../config/cloudinary.config');

// GET route - for create recipe form
router.get("/create", isLoggedIn, (req, res) => {
  //  const loggedInNavigation = true;
  res.render("recipe/create");
});

// POST route - for submit recipe create form
router.post("/create", isLoggedIn, fileUploader.single('recipe-cover-image'), async (req, res) => {
  try {
    const newRecipeInfo = req.body;
    const { _id } = req.session.currentUser;
    console.log(newRecipeInfo);
    if(!req.file) {
      const newRecipe = await Recipe.create({
        title: newRecipeInfo.title,
        cuisine: newRecipeInfo.cuisine,
        prepTime: newRecipeInfo.prepTime,
        cookTime: newRecipeInfo.cookTime,
        totalTime: Number(cookTime) + Number(prepTime),
        servings: newRecipeInfo.servings,
        instructions: newRecipeInfo.instructions,
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
        totalTime: Number(cookTime) + Number(prepTime),
        instructions: newRecipeInfo.instructions,
        imageUrl : req.file.path,
        Owner: _id,
      });
      res.redirect("/auth/home");
    }
    console.log(`new recipe: ${newRecipe}`);
    console.log(`file path: ${newRecipe.imageUrl}`);
    // console.log(req.file.path)
    
  } catch (err) {
    console.error(err);
  }
});

// GET route - for update recipe
router.get("/update/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const recipeToUpdate = await Recipe.findById(id);
    res.render("recipe/update", { recipeToUpdate });
  } catch (err) {
    console.error(err);
  }
});

// POST route - for submit update form
router.post("/update/:id", isLoggedIn, fileUploader.single('recipe-cover-image'), async (req, res) => {
  try {
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
      console.log(`if: ${imageUrl}`)
    } else {
      imageUrl = existingImage;
      console.log(`else: ${imageUrl}`)
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
});

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
    const searchedRecipe = await Recipe.findById(id);
    res.render("recipe/details", { searchedRecipe, currentUser });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
