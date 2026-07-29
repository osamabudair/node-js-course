// fetch data from database:
const mongoose = require("mongoose");     // --> mongoose library is important
const Joi = require('joi');

const AuthorSchema = new mongoose.Schema({       // declare 
  firstName:{
    type: String,
    required: true,
    trim: true,
    minlength:3,
    maxlength:200,
  },
  lastName:{
    type: String,
    required: true,
    trim: true,
    minlength:3,
    maxlength:200,
  },
  nationality:{
    type: String,
    required: true,
    trim: true,
    minlength:2,
    maxlength:100,
  },
  image:{
    type: String,
    default: "dafualt-avatar.png"
  },
}, {
  timestamps: true      // ---> create date and update date
});

const Author = mongoose.model("Author", AuthorSchema);     // model --> قالب // convert Author to authors in database

function validateCreateAuthor(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3).max(200).required(),
    lastName: Joi.string().trim().min(3).max(200).required(),
    nationality: Joi.string().trim().min(2).max(100).required(),
    image: Joi.string(),
  })

  return schema.validate(obj);
}

function validateUpdateAuthor(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3).max(200),
    lastName: Joi.string().trim().min(3).max(200),
    nationality: Joi.string().trim().min(2).max(100),
    image: Joi.string(),
  })

  return schema.validate(obj);
}

module.exports = {                                         
  Author, validateCreateAuthor, validateUpdateAuthor
}