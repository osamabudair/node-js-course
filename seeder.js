const { Book } = require("./models/Book");
const { Author } = require("./models/Author");
const { books, authors } = require("./data");
const connectToDB = require("./config/db");
require("dotenv").config();

// Connection to db
connectToDB();

// Improt Books
const importBooks = async () => {
  try {
    await Book.insertMany(books); // gives array to save it database
    console.log("Book Imported");
  } catch (error) {
    console.log(error);
    process.exit(1); // if error then disconnected
  }
}

// Improt Authors
const importAuthors = async () => {
  try {
    await Author.insertMany(authors);
    console.log("Authors Imported");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}


// Remove Books
const removeBooks = async () => {
  try {
    await Book.deleteMany();  // remove all books in database
    console.log("Books Removed");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

// Remove Books
const removeAuthors = async () => {
  try {
    await Author.deleteMany();  // remove all books in database
    console.log("Books Removed");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

if (process.argv[2] === "-import") {
  importBooks();
} else if (process.argv[2] === "-remove"){
  removeBooks();
} else if (process.argv[2] === "-import-authors"){
  importAuthors();
} else if (process.argv[2] === "-remove-authors"){
  removeAuthors();
}


// to run -> (node) (file name) (anything like -import or -remove) 
// --> node seeder -import