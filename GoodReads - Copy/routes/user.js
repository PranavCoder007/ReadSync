const express = require("express");
const User = require("../db/models/user");
const Book = require("../db/models/book");  
const router = express.Router();
const { auth } = require("../middleware/auth");

router.get("/charts", async (req, res) => {
  try {
    const trendingBooksByGenre = await Book.aggregate([
      { $match: { type: true } },  // Filter for trending books only
      { $group: { _id: "$genre", count: { $sum: 1 } } },  // Group by genre and count books
      { $sort: { count: -1 } }  // Optional: sort by count in descending order
    ]);

    if (!trendingBooksByGenre || trendingBooksByGenre.length === 0) {
      return res.status(404).json({ success: false, message: "No trending books found" });
    }

    res.status(200).json({
      success: true,
      data: trendingBooksByGenre
    });
  } catch (error) {
    console.error("Error fetching trending books by genre:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching trending books by genre",
    });
  }
});
router.get("/user-library-genre-distribution", async (req, res) => {
  try {
    const genreDistribution = await User.aggregate([
      { $unwind: "$books" }, // Unwind to get each book in the library as a separate document
      {
        $lookup: {
          from: "books", // The collection name of the Book model
          localField: "books.title", // Field in User's book array
          foreignField: "title", // Field in Book collection
          as: "bookDetails" // Output array of matched book details
        }
      },
      { $unwind: "$bookDetails" }, // Unwind the matched book details
      { $group: { _id: "$bookDetails.genre", count: { $sum: 1 } } }, // Group by genre and count
      { $sort: { count: -1 } } // Sort by count in descending order
    ]);

    if (!genreDistribution || genreDistribution.length === 0) {
      return res.status(404).json({ success: false, message: "No books found in user libraries" });
    }

    res.status(200).json({
      success: true,
      data: genreDistribution
    });
  } catch (error) {
    console.error("Error fetching genre distribution from user libraries:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching genre distribution from user libraries",
    });
  }
});

router.get("/trending", async (req, res) => {
  try {
    const books = await Book.find({type: true});
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


router.get("/library", async (req, res) => {
  const { userId } = req.query;  
  // console.log("Fetching books for user:", userId);

  try {
    
    const user = await User.findOne({username:userId});
    // console.log(user);
    if (!user) {
      // console.log("User not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.books || user.books.length === 0) {
      // console.log("books not found");
      return res.status(404).json({
        success: false,
        message: "No books found in the user's library",
      });
    }

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


router.post("/Register", async (req, res) => {
  // console.log(req.body)
  try {
    const user = new User({ ...req.body });
    await user.save();
    const token = await user.generateAuthToken();

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
    // console.log(error.message);

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

router.post("/Login", async (req, res) => {
  try {
    const user = await User.findByCredentials({ ...req.body });
    const token = await user.generateAuthToken();
    // console.log(typeof token);
    res.cookie("jwt", token, {
      sameSite: "strict",
      path: "/",
      httpOnly: true,
    });

    res.status(200).send({
      success: true,
      message: "Successfully logged in.",
      user: user.getPublicProfile(),
      token: token,
    });
  } catch (error) {
    res.status(401).send({
      success: false,
      message: error.message,
    });
  }
});

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

router.get("/Logout", auth, async (req, res) => {
  await User.findByIdAndUpdate(req.id, {
    $pull: { tokens: { token: req.token } },
  });
  res.clearCookie("jwt").send({
    success: true,
    message: "Successfully logged out",
  });
});
router.post("/addlib", async (req, res) => {
  const { userId, bookTitle } = req.body;
  // console.log("random");
  // console.log(userId+"--"+bookTitle);
  try {
    // Find the user by userId
    const user = await User.findOne({ username: userId });
    // console.log(user);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const book = await Book.findOne({ title: bookTitle });
    // console.log(book);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    const newBook = {
      title: book.title,
      author: book.author,
      totalpages: book.totalpages, 
      pagesread: 0, 
      twitterlink: "",
      bookimage: book.imageSrc,
    };

    const bookExists = user.books.some(userBook => userBook.title === book.title);
    if (bookExists) {
      return res.status(400).json({ success: false, message: "Book already in the library" });
    }

    user.books.push(newBook);

    await user.save();

    res.status(200).json({
      success: true,
      message: `Book "${book.title}" successfully added to the user's library`,
      books: user.books
    });
  } catch (error) {
    console.error("Error adding book to user's library:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding book to the library",
    });
  }
});
const updatePagesRead = async (userId, bookTitle, newPagesRead) => {
  try {
    const user = await User.findOne({ username: userId });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const bookIndex = user.books.findIndex((book) => book.title === bookTitle);
    if (bookIndex === -1) {
      return { success: false, message: "Book not found in the user's library" };
    }

    const book = user.books[bookIndex];
    if (newPagesRead < 0 || newPagesRead > book.totalpages) {
      return { success: false, message: "Invalid pagesRead value" };
    }
    user.books[bookIndex].pagesread = newPagesRead;

    await user.save();

    return { success: true, message: "Pages read updated successfully", books: user.books };
  } catch (error) {
    console.error("Error updating pages read:", error);
    return { success: false, message: "Server error while updating pages read" };
  }
};

router.post("/removelib", async (req, res) => {
  const { userId, bookTitle } = req.body;

  try {
    // Find the user by userId
    const user = await User.findOne({ username: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find the index of the book in the user's library
    const bookIndex = user.books.findIndex(book => book.title === bookTitle);
    if (bookIndex === -1) {
      return res.status(404).json({ success: false, message: "Book not found in the user's library" });
    }

    // Remove the book from the user's library
    user.books.splice(bookIndex, 1);
    
    await user.save();

    res.status(200).json({
      success: true,
      message: `Book "${bookTitle}" successfully removed from the user's library`,
      books: user.books
    });
  } catch (error) {
    console.error("Error removing book from user's library:", error);
    res.status(500).json({
      success: false,
      message: "Server error while removing book from the library",
    });
  }
});
// Route to fetch book details by title
router.get("/bookdetails/:bookTitle", async (req, res) => {
  const { bookTitle } = req.params; // Extracting book title from route params
  console.log(bookTitle);
  try {
    // Fetch the book details from bookdb using the book title
    const book = await Book.findOne({ title: bookTitle });
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found in the database" });
    }

    // Send the book details to the frontend
    res.status(200).json({
      success: true,
      book: book,
    });
  } catch (error) {
    console.error("Error fetching book details:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching book details",
    });
  }
});

router.post("/updatePagesRead", async (req, res) => {
  const { userId, bookTitle, pagesRead } = req.body;
  console.log(userId, bookTitle, pagesRead);
  const result = await updatePagesRead(userId, bookTitle, pagesRead);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});
router.post("/search", async (req, res) => {
  const { title } = req.body;
  console.log(title);
  try {
    const books = await Book.find({ title: { $regex: title, $options: "i" } });
    console.log(books);
    res.status(200).json({ success: true, books: books });
  } catch (error) {
    console.error("Error searching for books:", error);
    res.status(500).json({ success: false, message: "Server error while searching for books" });
  }
});
module.exports = router;







