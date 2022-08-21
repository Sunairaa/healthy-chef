const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect("/login");
  }
  next();
};

const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect("/logout");
  }
  next();
};

module.exports = { isLoggedIn, isLoggedOut };
