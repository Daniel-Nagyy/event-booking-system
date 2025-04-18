const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");


const app = express();
const userRoutes = require("./Routes/user");
const eventRoutes = require("./Routes/event");
const authRoutes = require("./Routes/auth");
const authrizationMiddleware = require("./Middleware/authorizationMiddleware");
const authenticationMiddleware=require('./Middleware/authenticationMiddleware');
const cors = require("cors");


require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser())

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use("/api/v1", authRoutes);

app.use(authrizationMiddleware);
app.use(authenticationMiddleware);

app.use("/api/v1/user", userRoutes);

app.use("/api/v1/event", eventRoutes);

const db_name = process.env.DB_NAME;

const db_url = `${process.env.DB_URL}/${db_name}`; // if it gives error try to change the localhost to 127.0.0.1



mongoose
  .connect(db_url)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => {
    console.log(e);
  });

app.use(function (req, res, next) {
  return res.status(404).send("404");
});
app.listen(process.env.PORT, () => console.log("server started"));
