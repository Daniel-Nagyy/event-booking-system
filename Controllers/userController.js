const usermodel = require('../Models/user');
const eventModel = require("../Models/Event");
const organizerModel = require('../Models/Organizer');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const secretKey = process.env.secretKey;
const userController = {
    getOrganizerAnalytics: async (req, res) => {
        try{
            const Organizer = await organizerModel.findById(req.user.id).populate('events');
            return res.status(200).json(Organizer.events);
        }
        catch(error){
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    register:async (req,res) =>{
        try {
            const {UserID,name,email, password,  role}= req.body;
            const existingUser = await usermodel.findOne({email})
            if(existingUser)
            {
                return res.status(409).json({message : "user already exists"});
            }
            const hashPassword = await bcrypt.hash(password,10);

            const newUser = new usermodel({
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
        login: async (req, res) => {
            try {
              const { email, password } = req.body;
        
              // Find the user by email
              const user = await usermodel.findOne({ email });
              if (!user) {
                return res.status(404).json({ message: "email not found" });
              }
        
              console.log("password: ", user.password);
              // Check if the password is correct
        
              const passwordMatch = await bcrypt.compare(password, user.password);
              if (!passwordMatch) {
                return res.status(405).json({ message: "incorect password" });
              }
        
              const currentDateTime = new Date();
              const expiresAt = new Date(+currentDateTime + 180000); // expire in 3 minutes
              // Generate a JWT token
              const token = jwt.sign(
                { user: { id: user._id, role: user.role } }, // changed UserID → id
                secretKey,
                { expiresIn: 3 * 60 } // or whatever expiration you want
              );
        
              return res
                .cookie("token", token, {
                  expires: expiresAt,
                  httpOnly: true,
                secure: false,
                sameSite: "lax",
                })
                .status(200)
                .json({ message: "login successfully", user });
            } catch (error) {
              console.error("Error logging in:", error);
              res.status(500).json({ message: "Server error" });
            }
          },
    getAllUsers: async (req,res)=>{
        try {
            const users = await usermodel.find();
            console.log("success");
            return res.status(200).json(users);
          
        }
        catch(error)
        {
            return res.status(500).json({message: error.message});
        }

    } ,


    updateUser: async (req,res)=> {
        try {
            const user = await usermodel.findByIdAndUpdate(
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
    getUserById: async (req, res) => 
        {
        try {
            const user = await usermodel.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
 
            getUserProfile : async (req, res) => {
                if (!req.user) {
                    return res.status(404).json({ error: 'User not found' });
                }

                res.json({
                    id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                });
            },
                deleteUser : async (req, res) => {
                    try {
                            const userId = req.params.id;
                            await usermodel.findByIdAndDelete(userId); // ← here is where it's failing

                        res.status(200).json({ message: 'User deleted successfully' });
                    } catch (error) {
                        console.error(error);
                        res.status(500).json({ message: 'Server error' });
                    }



                },
    forgotPassword: async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required." });
    }

    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Forget Password Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
    },

                
    

}

module.exports = userController;
