const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");
const Comment = require("../models/Comment.model");
const { isLoggedIn } = require("../middleware/route-guard");
const { restart } = require("nodemon");

router.post("/recipe/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const recipeToComment = await Recipe.findById(id);
    const { content, title } = req.body;
    const { currentUser } = req.session;

    const newComment = await Comment.create({
      content,
      title,
      author: currentUser._id,
      date: Date.now(),
    });
    console.log("NewComment", newComment);

    recipeToComment.comments.push(newComment._id);

    await recipeToComment.save();

    res.redirect(`/recipe/details/${id}`);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
