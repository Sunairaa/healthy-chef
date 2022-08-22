const session = require("express-session");
const MongoStore = require("connect-mongo");

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24h
      },
      store: new MongoStore({
        mongoUrl: "mongodb://0.0.0.0/healthy-chef",
        ttl: 1000 * 60 * 60 * 24, // 60sec * 60min * 24h => 1 day
      }),
    })
  );
};
