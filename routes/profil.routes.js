const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");
const fileUploader = require("../config/cloudinary.config");

router.get("/", isLoggedIn, (req, res) => {
  const { currentUser } = req.session;
  res.render("profil/profil", { currentUser });
});

router.post(
  "/",
  isLoggedIn,
  fileUploader.single("profil-picture"),
  async (req, res) => {
    try {
      const { currentUser } = req.session;
      currentUser.imageUrl = req.file.path;
      res.render("profil/profil", { currentUser });
    } catch (err) {
      console.log(err);
    }
  }
);

module.exports = router;
