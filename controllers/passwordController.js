const asycnHandler = require("express-async-handler");
const { User, validateChangePassword } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
/**
 * @desc Get forgot password
 * @route /password/forgot
 * @method GET
 * @access public
*/
const getForgotPassword = asycnHandler((req, res) => {
  res.render('forgot-password')
});


/**
 * @desc Send forgot password link
 * @route /password/forgot-password
 * @method POST
 * @access public
*/
const sendForgotPassword = asycnHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const secret = process.env.JWT_SECRET + user.password;
  const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: "10m" });

  const link = `http://localhost:5000/password/reset-password/${user._id}/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS
    }
  });

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: user.email,
    subject: "Password Reset",
    html: `<div>
             <h4>Password Reset</h4>
             <p>Click the link below to reset your password:</p>
             <a href="${link}">Reset Password</a>
           </div>`
  };

   transporter.sendMail(mailOptions, function (error, success) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "Error sending email" });
    } else {
      console.log("Email sent: " + success.response);
      res.render("link-send");
    }
  });
});


/**
 * @desc Get reset password view
 * @route /password/reset-password/:userId/:token
 * @method GET
 * @access public
*/
const getResetPasswordView = asycnHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const secret = process.env.JWT_SECRET + user.password;
  try {
    jwt.verify(req.params.token, secret);
    res.render('reset-password', { email: user.email });
  } catch (error) {
    console.log(error);
    res.json({message: "Error"})
  }
});


/**
 * @desc reset the password 
 * @route /password/reset-password/:userId/:token
 * @method POST
 * @access public
*/
const resetPassword = asycnHandler(async (req, res) => {
  const { error } = validateChangePassword(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const secret = process.env.JWT_SECRET + user.password;

  try {

    jwt.verify(req.params.token, secret);
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user.password = req.body.password;
    await user.save();
    res.render('success-password');

  } catch (error) {
    console.log(error);
    res.json({message: "Error"})
  }
});


module.exports = {
  getForgotPassword,
  sendForgotPassword,
  getResetPasswordView,
  resetPassword
}