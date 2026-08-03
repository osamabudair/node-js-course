const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");

// User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 200,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});

// Generate Token
UserSchema.methods.generateToken = function() {   // we need to write function not arrow funtion  
  return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET_KEY);
}

const User = mongoose.model("User", UserSchema);

// Validate Register User
function vaidateRegisterUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required(),
    username: Joi.string().trim().min(2).max(200).required(),
    password: passwordComplexity().required(),
  })
  return schema.validate(obj);
}

// Validate Login User
function vaidateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required(),
    password: passwordComplexity().required(),
  })
  return schema.validate(obj);
}

// Validate Update User
function vaidateUpdateUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100),
    username: Joi.string().trim().min(2).max(200),
    password: passwordComplexity(),
  })
  return schema.validate(obj);
}

// validate change password
function validateChangePassword(obj) {
  const schema = Joi.object({
    password: passwordComplexity().required(),
  });
  return schema.validate(obj);
}

module.exports = {
  User,
  vaidateRegisterUser,
  vaidateLoginUser,
  vaidateUpdateUser,
  validateChangePassword
}