// // require('./dotenv').config()

// const connectdb= require('./db/connection')
// const book = require('./db/models/book')
// const books = require('./books.json')

// const start = async () => {
//   try {
//     await connectdb("mongodb+srv://adityaatlasproject:IAS9Esk5aSflwmm6@cluster0.hrgh1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
//     await book.deleteMany()
//     console.log('Success!!!!')
//     process.exit(0)
//   } catch (error) {
//     console.log(error)
//     process.exit(1)
//   }
// }

// start()

// require('./dotenv').config()

// const connectdb = require('./db/connection');
// const Book = require('./db/models/book'); // Assuming this is the Mongoose model for books
// const books = require('./books.json'); // JSON data from books.json
// // console.log(books)

// const start = async () => {
//   try {
//     // Connect to MongoDB
//     await connectdb("mongodb+srv://adityaatlasproject:IAS9Esk5aSflwmm6@cluster0.hrgh1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    
//     // Delete existing records from the collection
//     await Book.deleteMany();
//     console.log('Existing records deleted successfully!');

//     // Insert books data from JSON file into the database
//     await Book.insertMany(books);
//     console.log('Books data inserted successfully!');

//     process.exit(0); // Exit the process on success
//   } catch (error) {
//     console.log('Error occurred:', error);
//     process.exit(1); // Exit the process on failure
//   }
// }


// start();


// require('./dotenv').config()

// require('./dotenv').config()

const connectdb = require('./db/connection');
const Book = require('./db/models/book'); // Assuming this is the Mongoose model for books
const books = require('./books.json'); // JSON data from books.json
const User = require('./user.json'); // JSON data from users.json
const UserModel = require('./db/models/user'); // Mongoose model for users

// Function to add a single book to the database
const addBookToDB = async (bookData) => {
  try {
    const newBook = new Book(bookData);
    await newBook.save();
    console.log(`Book titled "${bookData.title}" added to the database successfully!`);
  } catch (error) {
    console.error(`Error adding book titled "${bookData.title}":`, error);
  }
};

// Function to add a single user to the database
const addUserToDB = async (userData) => {
  try {
    const newUser = new UserModel(userData);
    await newUser.save();
    console.log(`User with username "${userData.username}" added to the database successfully!`);
  } catch (error) {
    console.error(`Error adding user "${userData.username}":`, error);
  }
};

const start = async () => {
  try {
    // Connect to MongoDB
    await connectdb("mongodb+srv://adityamhatrenirmala:HFtx0TRQ5WoTyVSd@cluster0.fwr8s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    
    // Delete existing records from the Book and User collections
    await Book.deleteMany();
    await UserModel.deleteMany();
    console.log('Existing records deleted successfully!');

    // Loop through the array of books and add each one to the database
    for (const book of books) {
      await addBookToDB(book);
    }

    // Loop through the array of users and add each one to the database
    for (const user of User) {
      await addUserToDB(user);
    }

    console.log('All books and users added to the database successfully!');
    process.exit(0); // Exit the process on success
  } catch (error) {
    console.log('Error occurred:', error);
    process.exit(1); // Exit the process on failure
  }
};

start();

