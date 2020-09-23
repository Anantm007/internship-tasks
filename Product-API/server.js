//jshint esversion: 6

const express = require('express');
const connectDB = require('./config/db');
const app = express();

// Connect Database
connectDB();

// GET request to the home route
app.get('/', function(req, res)
{
    res.send("API running");
});

// Define routes
app.use('/api/upload', require("./routes/api/upload"));
app.use('/api/products', require("./routes/api/products"));
app.use('/api/update', require("./routes/api/update"));
app.use('/api/delete', require("./routes/api/delete"));
app.use('/api/recover', require("./routes/api/recover"));

// Listening to the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, function()
{
  console.log("Server running on port " + PORT);
});
