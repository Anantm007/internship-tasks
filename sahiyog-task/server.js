const express = require("express");
const app = express();

// Middleware utilities
const bodyParser = require("body-parser");
const morgan = require("morgan");

// Mongoose
const mongoose = require("mongoose");

// Config variables
require("dotenv").config();
const { MONGOURI } = process.env;

// Connecting to the database
mongoose.promise = global.Promise;
mongoose.connect(
  MONGOURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err, db) => {
    if (err) console.log(err);
    else console.log("Database Connected...");
  }
);

// Getting data in json format
app.use(bodyParser.urlencoded({ extended: true }));

// Setting EJS engine
app.set("view engine", "ejs");
app.use(express.static("views"));

// Dev Middleware for logs
app.use(morgan("dev"));

// Mounting the routes
app.use("/", require("./routes/pages"));
app.use("/user/auth", require("./routes/userAuth"));
app.use("/user", require("./routes/user"));

// Starting the server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server started on port ${process.env.PORT || 5000}`);
});
