const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");

// Check if functions exist
console.log('sendRegistrationOTP:', typeof userController.sendRegistrationOTP);
console.log('verifyRegistrationOTP:', typeof userController.verifyRegistrationOTP);
console.log('resendRegistrationOTP:', typeof userController.resendRegistrationOTP);
console.log('login:', typeof userController.login);
console.log('forgotPassword:', typeof userController.forgotPassword);

// Registration with OTP
router.post("/register/send-otp", userController.sendRegistrationOTP);
router.post("/register/verify-otp", userController.verifyRegistrationOTP);
router.post("/register/resend-otp", userController.resendRegistrationOTP);

// Login
router.post("/login", userController.login);

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Forgot Password
router.put("/forgotPassword", userController.forgotPassword);

module.exports = router;