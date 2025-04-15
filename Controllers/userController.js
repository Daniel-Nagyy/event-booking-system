const UserModel = require("../Models/user");
const jwt = require("jsonwebtoken");
const bycrypt = require("bcrypt");
require("dotenv").config();
const secretKey = process.env.secretKey;
const userController = {
    register:async (req,res) =>{
        try {
            const {UserID,name,email, password,  role}= req.body;
            const existingUser = await UserModel.findOne({email})
            if(existingUser)
            {
                return res.status(409).json({message : "user already exists"});
            }
            const hashPassword = await bycrypt.hash(password,10);

            const newUser = new UserModel({
                UserID,
                name,
                email,
                password:hashPassword,
                role,
            });
            await newUser.save();
            res.status(201).json({message: "user registered successfully"});
        }
        catch(error)
        {
            console.error("error registering user:",error);
            res.status(500).json({message: "error registering user"});
        }

            


        },
    getAllUsers: async (req,res)=>{
            try {
                const users = await UserModel.find();
                return res.status(200).json(users);
            }
            catch(error)
            {
                return res.status(500).json({message: error.message});
            }
        
         } 
    }

    module.exports = userController;



