const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const { getAllBooks, getBookById, createBook, updateBook, deleteBook } = require("../controllers/bookController");

// Method Chaining
router
  .route("/")
  .get(getAllBooks)
  .post(verifyTokenAndAdmin, createBook);

router
  .route("/:id")
  .get(getBookById)
  .put(verifyTokenAndAdmin, updateBook)
  .delete(verifyTokenAndAdmin, deleteBook);

module.exports = router;
