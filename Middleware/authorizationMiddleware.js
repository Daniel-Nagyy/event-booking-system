const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
module.exports= function authorizationMiddleware(roles) {
    return (req, res, next) => {
      console.log('req:',req.user)
      const userRole = req.user.role;
      if (!roles.includes(userRole))
        return res.status(403).json("unauthorized access");
      // console.log('authormid')
      next();
    };
  }

