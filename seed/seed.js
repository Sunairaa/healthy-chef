const Ingredient = require('../models/Ingredient.model');
const data = require('./ingredients-data.json');
const mongoose = require('mongoose');

// ℹ️ Connects to the database
require("../db");

Ingredient.deleteMany()
    .then(() => Ingredient.insertMany(data))
    .then((result) => {
        console.log("Seeded data:" + JSON.stringify(result))
        mongoose.connection.close()
    })
    .catch((err) => console.error(err))
   