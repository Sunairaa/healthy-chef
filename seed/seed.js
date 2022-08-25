const Ingredient = require('../models/Ingredient.model');
const data = require('../routes/ingredients-data.json');
// ℹ️ Connects to the database
require("../db");

Ingredient.deleteMany()
    .then(Ingredient.insertMany(data))
    .then((result) => {
        console.log("Seeded data:" + result)
    })