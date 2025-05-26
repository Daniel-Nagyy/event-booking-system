const userModel = require('../Models/user');
const eventModel = require("../Models/Event");
const organizerModel = require('../Models/Organizer');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const secretKey = process.env.secretkey;
//for forgot password
const nodemailer = require("nodemailer");

const otpStore = new Map(); // Store: email -> { otp, hashedPassword, expiresAt }

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "noorjjj2006@gmail.com",       // Replace with real Gmail
      pass: "crfj epkw eblp rata",          // Replace with Gmail App Password
    },
  });

  const mailOptions = {
    from: "noorjjj2006@gmail.com",
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};
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
      const expiresAt = new Date(+currentDateTime + 1800000); // expire in 3 minutes
      // Generate a JWT token
      console.log(secretKey)
      const token = jwt.sign(
        { user: { _id: user._id, role: user.role } },
        secretKey,
        { expiresIn: 3 * 60000 } // or whatever expiration you want
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
      const userId = req.user._id; 
      const user = await userModel.findByIdAndUpdate(
        userId,
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
      const events = await eventModel.find({ organizer: userID });
      if(events.length ==0)
      {
        console.log("no events found for the user")
        return res.status(200).json({message: "no events found for the user"});
      }
      console.log("events found for the user")
      return res.status(200).json(events);
    }
    catch (error){
      return res.status(500).json({message: "error getting events" + error});
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




  getUserProfile: async (req, res) => {
    try {
      const userId = req.user._id; 

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

     res.json({ user });
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
      const { email, newPassword, otp } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      }

      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Step 1: No OTP yet → generate + send it
      if (!otp && newPassword) {
        const code = generateOTP();
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const expiresAt = Date.now() + 5 * 60 * 1000;

        otpStore.set(email, { otp: code, hashedPassword, expiresAt });

        await sendOTPEmail(email, code);
        return res.status(200).json({ message: "OTP sent to email." });
      }

      // Step 2: OTP is provided → verify and update password
      const record = otpStore.get(email);
      if (!record) {
        return res.status(400).json({ message: "No OTP request found." });
      }

      if (Date.now() > record.expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({ message: "OTP expired." });
      }

      if (otp !== record.otp) {
        return res.status(400).json({ message: "Invalid OTP." });
      }

      user.password = record.hashedPassword;
      await user.save();
      otpStore.delete(email);

      return res.status(200).json({ message: "Password successfully reset." });
    } catch (error) {
      console.error("Forgot Password Error:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  },

  
updateRole: async (req, res) => {
  try {
    const newRole = req.body.role; // get new role from request body

    if (!newRole) return res.status(400).json({ message: "Empty role" });

    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { role: newRole },
      { new: true } // return updated document
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("updated");
    return res.status(200).json({ message: "Role Updated Successfully", user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

}

module.exports = userController;
