const { Book } = require("./models/Book");
const { books } = require("./data");
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

if (process.argv[2] === "-import") {
  importBooks();
} else if (process.argv[2] === "-remove"){
  removeBooks();
}


// to run -> (node) (file name) (anything like -import or -remove) 
// --> node seeder -import