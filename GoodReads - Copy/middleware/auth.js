const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const { cookies } = req;
  if (cookies.jwt) {
    try {
      const data = jwt.verify(cookies.jwt, process.env.SECRET);
      req.id = data.id;
      req.token = cookies.jwt;
      return next();
    } catch (error) {
      console.log(error.message);
    }
  }

  return res.status(401).send({
    success: false,
    message: "Sorry you are not authenticated.",
  });
};

module.exports = { auth };
// const jwt = require('jsonwebtoken');

// const auth = (req, res, next) => {
//   const token = req.header('Authorization').replace('Bearer ', '');

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: 'Access denied. No token provided.'
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
//     req.id = decoded.id; // Add user ID to request object
//     next();
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({
//       success: false,
//       message: 'Invalid token.'
//     });
//   }
// };

// module.exports = {auth};

