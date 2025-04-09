const express = require("express");
const mongoose = require("mongoose");
const User = require("./Models/user");
const app = express();

// Middleware to parse JSON body
app.use(express.json());

mongoose
  .connect("mongodb+srv://kiroreda750:123456789kiro@main.f9n4gce.mongodb.net/?retryWrites=true&w=majority&appName=Main")
  .then(() => console.log("MongoDB connected"))
  .catch((e) => {
    console.log(e);
  });



