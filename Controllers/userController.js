const userModel = require('../Models/user');
const eventModel = require("../Models/Event");
const organizerModel = require('../Models/Organizer');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const secretKey = process.env.secretKey;
const nodemailer = require("nodemailer");
const userController = {
  register:async (req,res) =>{
    try {
      const {name,email, password,  role}= req.body;
      const existingUser = await userModel.findOne({email})
      if(existingUser)
      {
        return res.status(409).json({message : "user already exists"});
      }
      const hashPassword = await bcrypt.hash(password,10);

      const newUser = new userModel({
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
      const user = await userModel.findOne({ email });
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
        { user: { _id: user._id, role: user.role } },
        secretKey,
        { expiresIn: 3 * 600 } // or whatever expiration you want
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
      const users = await userModel.find();
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
      const user = await userModel.findByIdAndUpdate(
        req.params.id,
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
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'error', message: error.message });
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


  getUserProfile: async (req, res) => {
    try {
      const userId = req.user._id; 

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
       user
      });
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  deleteUser : async (req, res) => {
    try {
      const userId = req.params.id;
      await userModel.findByIdAndDelete(userId); // ← here is where it's failing

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

      const user = await userModel.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      // Send confirmation email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "noorjjj2006@gmail.com", // Replace with real project email
          pass: "crfj epkw eblp rata", // Replace with actual password or use environment variable
        },
      });

      const mailOptions = {
        from: "noorjjj2006",
        to: email,
        subject: "Password Reset Confirmation",
        text: `Your password has been successfully reset.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return reject(error);
        } else {
          console.log("Email sent:", info.response);
          resolve();
        }
      });

      // Wait for 1 minute before proceeding
      await new Promise(resolve => setTimeout(resolve, 60000));  // 60000ms = 1 minute
      console.log("1 minute delay completed.");
      await user.save();

      return res.status(200).json({ message: "Password updated and email sent. Please check your email for confirmation." });
    } catch (error) {
      console.error("Forgot Password Error:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  },



  updateRole: async (req, res)=>{
    try
    {
        const newRole = req.newRole

        if(!newRole) return res.status(400).message("Empty role")

        const user = await UserModel.findByIdAndUpdate(req.params.id,

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
