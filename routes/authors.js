const express = require("express");
const router = express.Router();
const asycnHandler = require("express-async-handler");   // we dont need try-catch anymore
const {verifyTokenAndAdmin} = require("../middlewares/verifyToken");
const { Author, validateCreateAuthor, validateUpdateAuthor } = require("../models/Author")   // import Author

/**
  * @desc Get all authors
  * @route /api/authors
  * @method GET
  * @access public
*/
// use async, await 
// find all authors, sorted by first name, just select the first and last name and dont show the id
// .sort({firstName: -1}).select("firstName lastName -_id")
router.get("/",asycnHandler(
  async (req, res) => {            
    const authorList = await Author.find();
    res.status(200).json(authorList);
}));

/**
  * @desc Get authors by id
  * @route /api/authors/:id
  * @method GET
  * @access public
*/
router.get("/:id", asycnHandler (
  async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (author) {
      res.status(200).json(author);
    } else {
      res.status(404).json({ message: "author not found" });
    }
}
));

/**
  * @desc create new authors 
  * @route /api/authors
  * @method GET
  * @access private (only admin)
*/
router.post("/", verifyTokenAndAdmin, asycnHandler(
  async (req, res) => {
    const { error } = validateCreateAuthor(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    // use try catch to find error if it exists
    const author = new Author({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationality: req.body.nationality,
      image: req.body.image,
    });
    const result = await author.save();  // if this line is true then save in db
    res.status(201).json(result);
}
));

/**
  * @desc update an author
  * @route /api/authors/:id
  * @method GET
  * @access private (only admin)
*/
router.put("/:id", verifyTokenAndAdmin, asycnHandler(
  async (req, res) => {
    const { error } = validateUpdateAuthor(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }
    const author = await Author.findByIdAndUpdate(
      req.params.id, 
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          nationality: req.body.nationality,
          image: req.body.image,
        }
        }, {
          new: true        // --> return update in mongodb 
        });
    res.status(200).json(author);
}
));

/**
  * @desc Delete an author
  * @route /api/authors/:id
  * @method Delete
  * @access private (only admin)
*/
router.delete("/:id", verifyTokenAndAdmin, asycnHandler(
  async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (author) {
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "author has been deleted" });
    } else {
      res.status(400).json({ message: "author not found" });
    }
}
));

module.exports = router;