

const connectdb = require('./db/connection');
const Book = require('./db/models/book'); 
const books = require('./books.json'); 
const users = require('./user.json'); 
const UserModel = require('./db/models/user'); 

const addBookToDB = async (bookData) => {
  try {
    const newBook = new Book({
      ...bookData,
      totalpages: bookData.numberOfPages  // Map numberOfPages from books.json to totalpages in the schema
    });
    await newBook.save();
    console.log(`Book titled "${bookData.title}" added to the database successfully!`);
  } catch (error) {
    console.error(`Error adding book titled "${bookData.title}":`, error);
  }
};

const addUserToDB = async (userData) => {
  try {
    const selectedBooks = [];
    while (selectedBooks.length < 2) {
      const randomIndex = Math.floor(Math.random() * books.length);
      const randomBook = books[randomIndex];
      if (!selectedBooks.includes(randomBook)) {
        selectedBooks.push(randomBook);
      }
    }

    const newUser = new UserModel({
      ...userData,
      books: selectedBooks.map(book => ({
        title: book.title,
        author: book.author,
        totalpages: book.numberOfPages,
        twitterlink: book.buylink,
        bookimage: book.imageSrc
      }))
    });

    await newUser.save();
    console.log(`User with username "${userData.username}" and 2 books added to the database successfully!`);
  } catch (error) {
    console.error(`Error adding user "${userData.username}":`, error);
  }
};

const start = async () => {
  try {
    await connectdb("mongodb+srv://adityamhatrenirmala:R4SSYpmMgFEC8nai@cluster0.0bj0m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
  
    await Book.deleteMany();
    await UserModel.deleteMany();
    console.log('Existing records deleted successfully!');

    for (const book of books) {
      await addBookToDB(book);
    }

    for (const user of users) {
      await addUserToDB(user);
    }

    console.log('All books and users added to the database successfully!');
    process.exit(0); 
  } catch (error) {
    console.log('Error occurred:', error);
    process.exit(1); 
  }
};

start();