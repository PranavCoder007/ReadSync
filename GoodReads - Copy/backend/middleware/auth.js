// auth.js (middleware)
// const auth = (req, res, next) => {
//   const { cookies } = req;
//   if (cookies.jwt) {
//     try {
//       const data = jwt.verify(cookies.jwt, process.env.SECRET);
//       req.id = data.id; 
//       req.token = cookies.jwt;  
//       return next();
//     } catch (error) {
//       console.log(error.message);
//     }
//   }
//   return res.status(401).send({
//     success: false,
//     message: "Sorry, you are not authenticated.",
//   });
// };
const jwt = require("jsonwebtoken");
const User = require("../db/models/user");

const auth = async (req, res, next) => {
  try {
    console.log("Auth middleware invoked"); // Check if middleware is hit
    const token = req.cookies.jwt; // Retrieve JWT from cookie
    console.log("Token from cookies:", token); // Log token

    if (!token) throw new Error('Authentication token missing');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const user = await User.findOne({ _id: decoded.id, 'tokens.token': token });
    console.log("User found:", user);

    if (!user) throw new Error('User not found');

    req.token = token;   // Attach token to request for future use if needed
    req.user = user;     // Attach user to request
    req.id = user._id;   // Attach user ID to request
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).send({ success: false, message: 'Please authenticate.' });
  }
};

module.exports = { auth };

