const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
const { sendGridKey } = require("./config/prod");
require("./models/User");
require("./models/Survey");
require("./services/passport");

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);
require("./routes/surveyRoutes")(app);

if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static("client/build"));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);

// past on chrome console, it shows array of json object

// const fetchAlbubs = () => {
//   fetch("https://rallycoding.herokuapp.com/api/music_albums")
//     .then(res => res.json())
//     .then(json => console.log(json));
// }

// fetchAlbubs();

//  const  fetchAlbubs = async() => {
//   const res = await fetch("https://rallycoding.herokuapp.com/api/music_albums")
//   const json = await res.json()
//   console.log(json);
// }

// fetchAlbubs();

//  "scripts": {
//     "start": "node index.js",
//     "server": "nodemon index.js",
//      "client": "npm run start --prefix client",
//     "dev": "concurrently \"npm run server\" \"npm run client\" \"npm run webhook\"",
//     "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client",
//     "webhook": "./sendgrid_webhook.sh"
//   },

// "proxy": {
//     "/auth/google": {
//       "target": "http://localhost:5000"
//     },
//     "/api/*": {
//       "target": "http://localhost:5000"
//     }
//   },

// sendGridKey: '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'
