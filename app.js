const express = require('express');
const mongoose = require("mongoose");
const cookieParser=require('cookie-parser')
const User = require("./Models/user");
const app = express();
const authRouter = require("./Routes/auth");
const userRouter = require("./Routes/user");

const authorizationMiddleware = require("./Middleware/authorizationMiddleware");
require('dotenv').config();

// Middleware to parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
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
  app.use(authorizationMiddleware);
  app.use ("/api/v1",userRouter);
  //asd
  const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

dotenv.config();


app.use(express.json());
app.use('/api/v1/users', userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error('Mongo error:', err));
