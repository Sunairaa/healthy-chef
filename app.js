// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

hbs.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
require("./config/sessions.config")(app);

// default value for title local
const capitalized = require("./utils/capitalized");
const projectName = "healthy-chef";

app.locals.appTitle = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);
// route for authentication
const auth = require("./routes/auth.routes");
app.use("/auth", auth);
// route for recipe
const recipe = require("./routes/recipe.routes");
app.use("/recipe", recipe);
// route for profil
const profil = require("./routes/profil.routes");
app.use("/profil", profil);
// route for comments
const comment = require("./routes/comment.routes");
app.use("/comment", comment);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
