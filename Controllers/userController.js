const UserModel = require("../Models/user");
const eventModel = require("../Models/Event");
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
        
         } ,
    

    updateUser: async (req,res)=> {
        try {
            const user = await UserModel.findByIdAndUpdate(
                req.params.UserID,
                {
                    name: req.body.name,
                    email: req.body.email,
                    profilePicture: req.profilePicture
                },
                {
                    new: true,
                }
            );
            return res.status(200).json({user,msg:"User updated successfully"});
            
        }
        catch (error)
        {
            return res.status(500).json({message: error.message});
        }
    },

    getUserEvents: async(req,res)=>
    {
try {
    const userID = req.user._id;
    const events = await eventModel.find({participants: userID})
    if(events.length ==0)
    {
        return res.status(200).json({message: "no events found for the user"});
    }
    return res.status(200).json(events);
}
catch (error){
    return res.status(500).json({message: "error getting events"});
}
    }
}

    module.exports = userController;

    exports.getUserProfile = async (req, res) => {
        if (!req.user) {
          return res.status(404).json({ error: 'User not found' });
        }
      
        res.json({
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
        });
      };
      
// controllers/userController.js
const User = require("../Models/user");

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.remove();  // Delete the user

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

