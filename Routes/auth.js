const express = require("express");
const router = express.Router();
const userController= require("../Controllers/userController");
router.post("/register",userController.register);
module.exports = router;
// routes/authRoutes.js

const { updatePassword } = require('../controllers/authController');

// PUT /api/v1/forgetPassword - public route to update password
router.put('/forgetPassword', updatePassword);

module.exports = router;
