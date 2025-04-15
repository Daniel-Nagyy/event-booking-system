 function authorizationMiddleware(roles) {
  return (req, res, next) => {
    console.log("req:", req.user);
    const userRole = req.user.role;
    if (!roles.includes(userRole))
      return res.status(403).json("unauthorized access");
    // console.log('authormid')
    next();
  };
};

function authorizeUserbyID(req,res,next)
{
  const userID = req.user?.id;
  const targetID = req.params.id;
  if (userID==targetID)
    return next();
}

module.exports={
  authorizationMiddleware,authorizeUserbyID
};
const jwt = require('jsonwebtoken');
const User = require('../Models/user.js');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};
// controllers/authController.js
const bcrypt = require('bcryptjs');
const User = require('../Models/user.js');
const jwt = require('jsonwebtoken');

// Function to handle updating the password
exports.updatePassword = async (req, res) => {
  try {
    const { email, newPassword, resetToken } = req.body;

    // Validate input
    if (!email || !newPassword || !resetToken) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // Find user by email and reset token
    const user = await User.findOne({ email, resetToken });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash the new password and save it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;  // Clear the reset token once it's used
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../Models/user.js');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();  // User is admin, allow them to proceed
  } else {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
};
