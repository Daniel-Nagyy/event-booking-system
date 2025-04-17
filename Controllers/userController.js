const UserModel = require("../Models/user");
const eventModel = require("../Models/Event");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
            const hashPassword = await bcrypt.hash(password,10);

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
    

    updateUser: async (req,res)=>
    {
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
    },


    login: async(req,res)=>
    {
       try{
            const {email, password} = req.body;

            const user = await UserModel.findOne({email})
            //find user by email
            if(!user){
                return res.status(404).json({message:"email not found"});
            }

            const passwordMatch = await bcrypt.compare(password, user.password)
            if(!passwordMatch){
                return res.status(405).json({message: "incorrect Password"});
            }


            const currentDateTime = new Date();
            const expiresAt = new Date(currentDateTime + 18000000)//expires after 3 minutes
            //Generate jwt token 
            const token = jwt.sign(
                
                {user: {userID: user._id, role: user.role}},
                secretKey,
                {expiresIn: 3*60*60,},
                
            );
            
            return res
            .cookie("token", token, {
            expires: expiresAt,
            httpOnly: true,
            secure: true, // keep it during dev
            SameSite: "none",
            })
            .status(200)
            .json({ message: "login successfully", user });
        }
        catch(err){
            console.error("Error logging in:", error);
            res.status(500).json({ message: "Server error" });
        }
    }, 

    updateRole: async (req, res)=>{
        try
        {
            const newRole = req.newRole

            if(!newRole) return res.status(400).message("Empty role")

            const user = await UserModel.findByIdAndUpdate(req.params.UserID,

                {
                    role: req.body.role
                },
                {
                    new: true, 
                }
            );
            return res.status(200).message("Role Updated Successfully")
            
        }
        catch(err)
        {
            return res.status(500).json({message: error.message});
        }
    }
}

    module.exports = userController;