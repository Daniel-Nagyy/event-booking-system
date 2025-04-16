const express = require('express');
const mongoose = require("mongoose");
const cookieParser=require('cookie-parser')
const cors = require("cors");
const User = require("./Models/user");
const app = express();
const authRouter = require("./Routes/auth");
const userRouter = require("./Routes/user");

const authorizationMiddleware = require("./Middleware/authorizationMiddleware");
const authenticationMiddleware=require('./Middleware/authenticationMiddleware');

require('dotenv').config();

// Middleware to parse JSON body
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


const DB_URL = process.env.DB_URL;
mongoose
  .connect(
    process.env.DB_URL,
  )
  .then(() => console.log("MongoDB connected"))
  .catch((e) => {
    console.log(e);
  });

  app.listen(process.env.PORT, () =>  console.log(`Server started, listening on port ${process.env.PORT}!`));

  app.get('/test',(req , res)=>{
    res.send("testing");
  });

  app.use("/api/v1",authRouter); 
  app.use(authenticationMiddleware);
  app.use ("/api/v1",userRouter);