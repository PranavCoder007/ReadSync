const express = require("express");
const User = require("../db/models/user");
const Book = require("../db/models/book");  // Importing the Book model
const router = express.Router();
const { auth } = require("../middleware/auth");

// Get all books route
router.get("/trending", async (req, res) => {
  try {
    const books = await Book.find({});
    console.log(books);
    if (!books || books.length === 0) {
      return res.status(404).json({ success: false, message: "No books found" });
    }
    res.status(200).json({
      success: true,
      books: books
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching books",
    });
  }
});

// Get book by title route
router.get("/books/:title", async (req, res) => {
  try {
    const bookTitle = req.params.title;
    const book = await Book.findOne({ title: bookTitle });

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.status(200).json({
      success: true,
      book: book,
    });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching book",
    });
  }
});

// Get books from the logged-in user's library
router.get("/library", auth, async (req, res) => {
  try {
    // Retrieve the user's information using the ID from the auth middleware
    const user = await User.findById(req.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the user has books in their library
    if (!user.books || user.books.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No books found in the user's library",
      });
    }

    // Return the user's books
    res.status(200).json({
      success: true,
      books: user.books,
    });
  } catch (error) {
    console.error("Error fetching user's library:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user's library",
    });
  }
});


// Sign up route, used for creating new accounts
router.post("/Register", async (req, res) => {
  console.log(req.body)
  try {
    const user = new User({ ...req.body });
    await user.save();
    const token = await user.generateAuthToken();

    // Creating a http-only cookie, which is used for authorization
    res.cookie("jwt", token, {
      sameSite: "strict",
      path: "/",
      httpOnly: true,
    });

    res.status(201).send({
      success: true,
      message: "Successfully created an account",
      user: user.getPublicProfile(),
    });
  } catch (error) {
    const message = error.message;
    let errorMessage = "";
    console.log(error.message);

    // Checking for duplicates
    if (message.includes("username")) {
      errorMessage =
        "Oops, the username you have entered already exists, try a different one";
    } else if (message.includes("email")) {
      errorMessage =
        "Looks like you have an account associated with us. Please login.";
    } else {
      errorMessage = "Oops, something went wrong, try again.";
    }

    res.status(400).send({
      success: false,
      message: errorMessage,
    });
  }
});

// Login route used to log in existing users
router.post("/Login", async (req, res) => {
  try {
    const user = await User.findByCredentials({ ...req.body });
    const token = await user.generateAuthToken();

    // Creating a http-only cookie, which is used for authorization
    res.cookie("jwt", token, {
      sameSite: "strict",
      path: "/",
      httpOnly: true,
    });

    res.status(200).send({
      success: true,
      message: "Successfully logged in.",
      user: user.getPublicProfile(),
    });
  } catch (error) {
    res.status(401).send({
      success: false,
      message: error.message,
    });
  }
});

// Authenticating the http-only cookie
router.get("/User", auth, async (req, res) => {
  const id = req.id;
  const user = await User.findById(id);
  if (user) {
    res.send({
      success: true,
      message: "Successfully Authenticated",
      user: user.getPublicProfile(),
    });
  } else {
    res.status(401).send({
      success: false,
      message: "Not authenticated",
    });
  }
});

// Logout route used to log out users
router.get("/Logout", auth, async (req, res) => {
  await User.findByIdAndUpdate(req.id, {
    $pull: { tokens: { token: req.token } },
  });
  res.clearCookie("jwt").send({
    success: true,
    message: "Successfully logged out",
  });
});

module.exports = router;




// const express = require("express");
// const User = require("../db/models/user");
// const router = express.Router();
// const { auth } = require("../middleware/auth");

// // Sign up route, used for creating new accounts
// router.post("/Register", async (req, res) => {
//   try {
//     const user = new User({ ...req.body });
//     const token = await user.generateAuthToken();

//     // Creating a http only cookie, which is used for authorization
//     res.cookie("jwt", token, {
//       sameSite: "strict",
//       path: "/",
//       httpOnly: true,
//     });

//     res.status(201).send({
//       success: true,
//       message: "Successfully created an account",
//       user: user.getPublicProfile(),
//     });
//   } catch (error) {
//     const message = error.message;
//     let errorMessage = "";
//     console.log(error.message);
//     // Checking for duplicates
//     if (message.includes("username")) {
//       errorMessage =
//         "Opps, the username you have enter already exists, try a different one";
//     } else if (message.includes("email")) {
//       errorMessage =
//         "Looks like you have an account associated with us. Please login in.";
//     } else {
//       errorMessage = "Opps, something went wrong, try again.";
//     }

//     res.status(400).send({
//       success: false,
//       message: errorMessage,
//     });
//   }
// });

// // Login route used to login existing users
// router.post("/Login", async (req, res) => {
//   try {
//     const user = await User.findByCredentials({ ...req.body });
//     const token = await user.generateAuthToken();

//     // Creating a http only cookie, which is used for authorization
//     res.cookie("jwt", token, {
//       sameSite: "strict",
//       path: "/",
//       httpOnly: true,
//     });

//     res.status(200).send({
//       success: true,
//       message: "Successfully logged in.",
//       user: user.getPublicProfile(),
//     });
//   } catch (error) {
//     res.status(401).send({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// // Authenticating the http only cookie
// router.get("/User", auth, async (req, res) => {
//   const id = req.id;
//   const user = await User.findById(id);
//   if (user) {
//     res.send({
//       success: true,
//       message: "Successfully Authenticated",
//       user: user.getPublicProfile(),
//     });
//   } else {
//     res.status(401).send({
//       success: false,
//       message: "Not authenticated",
//     });
//   }
// });

// router.get("/Logout", auth, async (req, res) => {
//   await User.findByIdAndUpdate(req.id, {
//     $pull: { tokens: { token: req.token } },
//   });
//   res.clearCookie("jwt").send({
//     success: true,
//     message: "Successfully logged out",
//   });
// });

// module.exports = router;


