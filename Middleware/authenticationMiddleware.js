const jwt = require("jsonwebtoken");
const secretKey = process.env.secretKey;

module.exports = function authenticationMiddleware(req, res, next) {
  const cookie = req.cookies;

  console.log('inside auth middleware');
  console.log(cookie);

  if (!cookie) {
    return res.status(401).json({ message: "No Cookie provided" });
  }
  const token = cookie.token;
  console.log("token:", token);
  if (!token) {
    return res.status(405).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      console.log("Cookies:", req.cookies);
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded.user;
    console.log(req.user.email);
    next();
  });
};
