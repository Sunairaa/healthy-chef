const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  const { currentUser } = req.session;
  res.render("index", { currentUser });
});



module.exports = router;
