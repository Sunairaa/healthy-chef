const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");

const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

// ********* require fileUploader in order to use it *********
// const fileUploader = require('../config/cloudinary.config');

// GET route - for create recipe form
router.get("/create", isLoggedIn, (req, res) => {
    //  const loggedInNavigation = true;
    res.render('recipe/create')
})

// POST route - for submit recipe create form
router.post("/create", isLoggedIn, async (req, res) => {
    try{
        const { title, cuisine, prepTime, cookTime, servings, instructions, imageUrl } = req.body;
        const { _id } = req.session.currentUser;
        console.log(title)
        const newRecipe = await Recipe.create({ title, cuisine, prepTime, cookTime, servings, instructions, imageUrl, Owner:_id })
                console.log(`new recipe: ${newRecipe}`)
                res.redirect('/auth/home')
    } catch(err) {
        console.error(err)
    }
})

// GET route - for update recipe
router.get("/update/:id", isLoggedIn, async (req, res) => {
    try{
        const { id } = req.params;
        const recipeToUpdate = await Recipe.findById(id)
            res.render('recipe/update', { recipeToUpdate });
    }
    catch(err) {
        console.error(err)
    }
})

// POST route - for submit update form
router.post("/update/:id", isLoggedIn, async (req, res) => {
    try{
        const { id } = req.params;
        const { title, cuisine, prepTime, cookTime, servings, instructions, imageUrl } = req.body; 
    }
    catch(err) {
        console.error(err)
    }
})

// GET route - 
module.exports = router;