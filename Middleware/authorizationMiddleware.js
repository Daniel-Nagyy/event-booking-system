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
