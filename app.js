const express = require('express');
const mongoose = require("mongoose");
const User = require("./Models/user");
const app = express();
const authRouter = require("./Routes/auth");
const userRouter = require("./Routes/user");
const authorizationMiddleware = require("./Middleware/authorizationMiddleware");
require('dotenv').config();

// Middleware to parse JSON body
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://kiroreda750:123456789kiro@main.f9n4gce.mongodb.net/?retryWrites=true&w=majority&appName=Main",
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
  //app.use(authorizationMiddleware);
  app.use ("/api/v1",userRouter);