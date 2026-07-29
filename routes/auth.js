const express = require("express");
const router = express.Router();
const asycnHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, vaidateRegisterUser, vaidateLoginUser, vaidateUpdateUser} = require("../models/User");

/**
  * @desc Register New User
  * @route /api/auth/register
  * @method POST
  * @access public
*/
router.post("/register",asycnHandler( async (req,res) => {
  const { error } = vaidateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  } 

  let user = await User.findOne({ email: req.body.email });
  if (user) {  // if user is register before dont register again
    return res.status(400).json({ message: "This user already registerd" });
  }

  const salt = await bcrypt.genSalt(10);  // hash the password to safe
  req.body.password = await bcrypt.hash(req.body.password, salt);

  user = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  })

  const result = await user.save();
  const token = user.generateToken();

  const { password, ...other } = result._doc;   // dont show the password field 

  res.status(201).json({ ...other, token });

}));


/**
  * @desc Login User
  * @route /api/auth/login
  * @method POST
  * @access public
*/
router.post("/login",asycnHandler( async (req,res) => {
  const { error } = vaidateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  } 

  let user = await User.findOne({ email: req.body.email });
  if (!user) {  // if user null (not found)
    return res.status(400).json({ message: "Invalid Email or Password" });
  }

  const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid Email or Password" });
  }
  const token = user.generateToken(); // new token
  const { password, ...other } = user._doc;   // dont show the password field 

  res.status(200).json({ ...other, token });

}));

module.exports = router;