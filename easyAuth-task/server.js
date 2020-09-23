const express = require("express");
const app = express();

// Middleware utilities
const bodyparser = require("body-parser");
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
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json({ extended: false }));

// Dev Middleware for logs
app.use(morgan("dev"));

// Test route
app.get("/", async (req, res) => {
  return res
    .status(200)
    .json({
      message:
        "API runnning, for detailed documentaion refer: https://github.com/Anantm007/easyAuth-task",
    });
});

// Mounting the routes
app.use("/api/products", require("./routes/products"));

// Starting the server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
