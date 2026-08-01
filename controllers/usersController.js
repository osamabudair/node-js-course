const asycnHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, vaidateUpdateUser} = require("../models/User");

/**
  * @desc Update User
  * @route /api/users/:id
  * @method PUT
  * @access private
*/
const updateUser =  asycnHandler( async(req, res) => {
  const { error } = vaidateUpdateUser(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message })
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, {
    $set: {
      email:req.body.email,
      username:req.body.username,
      password:req.body.password,
    }
  }, { new: true}).select("-password");

  res.status(200).json(updatedUser);

});


/**
  * @desc Get All Users
  * @route /api/users
  * @method GET
  * @access private (only admin)
*/
const getAllUsers = asycnHandler( async(req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});


/**
  * @desc Get user by id
  * @route /api/users/:id
  * @method GET
  * @access private (only admin & user himself)
*/
const getUserById = asycnHandler( async(req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "user not found" });
  }
});


/**
  * @desc Delete User
  * @route /api/users/:id
  * @method DElETE
  * @access private (only admin & user himself)
*/
const deleteUser = asycnHandler( async(req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "user has been deleted successfully" });
  } else {
    res.status(404).json({ message: "user not found" });
  }
})

module.exports = {
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser
};