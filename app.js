const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect("mongodb+srv://kiroreda750:123456789kiro@main.f9n4gce.mongodb.net/?retryWrites=true&w=majority&appName=Main")
  .then(() => console.log("mongoDB connected"))
  .catch((e) => {
    console.log(e);
  });

