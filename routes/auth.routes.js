// THIS FILE HANDLES SIGNUP / LOG IN / LOGOUT
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const router = require("express").Router();
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

// SIGNUP
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, password, email } = req.body;
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      imageUrl,
    });
    const createdUser = await newUser.save();
    res.redirect("/auth/login");
  } catch (err) {
    console.log(err);
  }
});

// LOG IN & HOME PAGE

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Both fields are mandatory to login",
    });
    return;
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.render("auth/login", {
        errorMessage: "Email not registered, please try with other email",
      });
      return;
    } else if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect("/home", user);
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/home", (req, res) => {
  const { currentUser } = req.session;
  res.render("/home", currentUser);
});

// LOG OUT
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/index");
});

module.exports = router;
