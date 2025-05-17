const express = require("express");
const router = express.Router();

const userController = require("../Controllers/userController");

// * login
router.post("/login",userController.login );
// * register
router.post("/register",userController.register);
//forget password
router.put("/forgotPassword", userController.forgotPassword);

module.exports = router;

