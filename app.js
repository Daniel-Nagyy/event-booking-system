const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
//Test

const app = express();
const userRoutes = require("./routes/user");
const bookingRoutes = require("./routes/booking");
const eventRoutes = require("./routes/event");
const authRoutes = require("./routes/auth");
const authrizationMiddleware = require("./Middleware/authorizationMiddleware");

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
//to verify the user token
app.use("/api/v1", authRoutes);
//to check if the user is authrized 
app.use(authrizationMiddleware);
//to get the user booking
app.use("/api/v1/user", userRoutes);
//to get the booking
app.use("/api/v1/booking", bookingRoutes);
//to get the event
app.use("/api/v1/event", eventRoutes);

const db_name = process.env.DB_NAME;
// * Cloud Connection
// const db_url = `mongodb+srv://TestUser:TestPassword@cluster0.lfqod.mongodb.net/${db_name}?retryWrites=true&w=majority`;
// * Local connection
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

