const express = require("express");
const router = express.Router();
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middlewares/verifyToken")
const { getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/usersController");

router.get("/", verifyTokenAndAdmin, getAllUsers);

// Method Chaining
router
  .route("/:id")
  .get(verifyTokenAndAuthorization, getUserById)
  .put(verifyTokenAndAuthorization, updateUser)
  .delete(verifyTokenAndAuthorization, deleteUser);

module.exports = router;