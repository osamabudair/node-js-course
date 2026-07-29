const express = require("express");
const router = express.Router();
const asycnHandler = require("express-async-handler"); 
const {verifyTokenAndAdmin} = require("../middlewares/verifyToken");
const { Book, validateCreateBook, validateUpdateBook } = require("../models/Book")

/**
  * @desc Get all books
  * @route /api/books
  * @method GET
  * @access public
*/
router.get("/", asycnHandler(async (req, res) => {
  const books = await Book.find().populate("author", ["_id", "firstName", "lastName"]);
  res.status(200).json(books)
}));

/**
  * @desc Get book by id
  * @route /api/books/:id
  * @method GET
  * @access public
*/
router.get("/:id", asycnHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate("author");
  if (book) {
    res.status(200).json(book)
  } else{
    res.status(404).json({ message: "book not found"})
  }
}));

/**
  * @desc create new book
  * @route /api/books
  * @method POST
  * @access private (only admin)
*/
router.post("/", verifyTokenAndAdmin, asycnHandler(async (req, res) => {

  const { error } = validateCreateBook(req.body);

  if (error) {
    return res.status(400).json({message: error.details[0].message});
  }

  const book = new Book (
    {
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      price: req.body.price,
      cover: req.body.cover
    }
  );

  const result = await book.save();
  res.status(201). json(result);
}));

/**
  * @desc update a book
  * @route /api/books/:id
  * @method PUT
  * @access private (only admin)
*/
// Any thing come from client we need a validation
router.put("/:id", verifyTokenAndAdmin, asycnHandler(async (req,res) => {
  const { error } = validateUpdateBook(req.body);

  if (error) {
    return res.status(400).json({message: error.details[0].message});
  }

  const updatedBook = await Book.findByIdAndUpdate(req.params.id, {
    $set: {
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      price: req.body.price,
      cover: req.body.cover
    }
  }, {
    new: true
  });

  res.status(200).json(updatedBook);
}));

/**
  * @desc delete a book
  * @route /api/books/:id
  * @method DELETE
  * @access private (only admin)
*/
router.delete("/:id", verifyTokenAndAdmin, asycnHandler(async (req,res) => {
  const book = Book.findById(req.params.id);
  if (book) {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({message: "book has been deleted"})
  } else {
    res.status(404).json({message: "book not found"})
  }
}));

module.exports = router;