const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");
const Comment = require("../models/Comment.model");
const { isLoggedIn } = require("../middleware/route-guard");

router.post("/details/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content, author } = req.body;

    const newComment = await Comment.create({
      content,
      title: author.fullName,
      date,
      image: author.imageUrl,
    });


  } catch (err) {
    console.log(err);
  }
});
