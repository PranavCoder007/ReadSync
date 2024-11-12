const express = require("express");
const User = require("../db/models/user");
const Book = require("../db/models/book");  
const router = express.Router();
const { auth } = require("../middleware/auth");

router.get("/charts", async (req, res) => {
  try {
    const trendingBooksByGenre = await Book.aggregate([
      { $match: { type: true } },  
      { $group: { _id: "$genre", count: { $sum: 1 } } }, 
      { $sort: { count: -1 } }  
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
      { $unwind: "$books" }, 
      {
        $lookup: {
          from: "books", 
          localField: "books.title", 
          foreignField: "title", 
          as: "bookDetails" 
        }
      },
      { $unwind: "$bookDetails" }, 
      { $group: { _id: "$bookDetails.genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } } 
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
    res.cookie("jwt", token, {
      path: "/",
      httpOnly: true,
      sameSite: "Lax", 
      secure: false,   
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
  try {
    const user = req.user; 
    console.log(user);
    res.send({
      success: true,
      message: "Successfully authenticated",
      user: user.getPublicProfile(), 
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server error during authentication",
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
  try {
    const user = await User.findOne({ username: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const book = await Book.findOne({ title: bookTitle });
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
      genre: book.genre,
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
router.get("/bookdetails/:bookTitle", async (req, res) => {
  const { bookTitle } = req.params; 
  console.log(bookTitle);
  try {
    const book = await Book.findOne({ title: bookTitle });
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found in the database" });
    }
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

  if (!title || title.length < 2) {
    return res.status(400).json({ success: false, message: "Invalid search input" });
  }

  try {
    const regex = new RegExp(title, "i"); 

    const books = await Book.find({ title: regex })
      .limit(20)
      .sort({ title: 1 }); 

    res.status(200).json({ success: true, books });
  } catch (error) {
    console.error("Error searching for books:", error);
    res.status(500).json({ success: false, message: "Server error while searching for books" });
  }
});

router.post("/recommendations", async (req, res) => {
  try {
    const { username, searchItems } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!Array.isArray(searchItems) || searchItems.length === 0) {
      return res.status(400).json({ success: false, message: "No search history provided" });
    }

    const searchRegex = new RegExp(searchItems.join("|"), "i");
    const recommendedBooks = await Book.find({
      $or: [{ title: searchRegex }, { author: searchRegex }],
    })
      .limit(6)
    console.log("REcommend"+recommendedBooks);
    res.status(200).json({ success: true, books: recommendedBooks });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ success: false, message: "An error occurred while fetching recommendations" });
  }
});
module.exports = router;







