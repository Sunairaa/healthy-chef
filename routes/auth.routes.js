// THIS FILE HANDLES SIGNUP / LOG IN / LOGOUT
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const router = require("express").Router();
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

// // SIGNUP
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, async (req, res) => {
  try {
    const { fullName, password, email } = req.body;

    if (!email || !password || !fullName) {
      res.status(500).render("auth/signup", {
        errorMessage: "All fields are mandatory",
      });
      return;
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(500).render("auth/signup", {
        errorMessage:
          "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    const createdUser = await newUser.save();
    res.redirect("/auth/login");
  } catch (err) {
    console.log(err);
  }
});

// LOG IN & HOME PAGE

router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, async (req, res) => {
  try {
    console.log(req.body);

    const { email, password } = req.body;

    if (email === "" || password === "") {
      res.redirect("/auth/login", {
        errorMessage: "Both fields are mandatory to login",
      });
      return;
    }

    let user = await User.findOne({ email });
    if (!user) {
      res.render("auth/login", {
        errorMessage: "Email not registered, please try with other email",
      });
      return;
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      console.log("user", user);
      res.redirect("/auth/home");
    }
  } catch (err) {
    console.log(err);
  }
});

//HOME PAGE
router.get("/home", isLoggedIn, (req, res) => {
  const { currentUser } = req.session;
  res.render("home", currentUser);
});

// LOG OUT
router.post("/logout", isLoggedIn, (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
});

//HOME PAGE
router.get("/create", (req, res) => {
  res.render("recipes/recipe-create");
});

module.exports = router;
