require("dotenv").config();

//mongodb user model
require("./config/config");

const express = require("express");
const router = require("./routes/router");
const userRouter = require("./routes/user");
const sassMiddleware = require("node-sass-middleware");
const path = require("path");
const session = require("express-session");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const app = express();

app.set("view engine", "pug");

app.use(flash());
//set app use
app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    debug: true,
    indentedSyntax: false,
    sourceMap: true,
    outputStyle: "compressed",
  })
);

// Express Session
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
  })
);

// app.use(express.static(__dirname + '/public'));
app.use(express.static("public"));

app.use("/", router);
app.use("/", userRouter);

app.listen(3000, "127.0.0.1", () => {
  console.log(`app is running`);
});
