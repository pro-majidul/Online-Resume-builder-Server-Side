const express = require("express");
const router = express.Router();
const {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  signout,
  googleLogin
} = require("../controllers/authControllers");

// user sign up or create a new account 
router.post("/signup", registerUser);

// user logout
router.post("/signout", signout);

// user login 
router.post("/signin", loginUser);

// goole login api 
router.post("/google-login", googleLogin);

// get all users information 
router.get("/users", getUsers);
// get a specif user information
router.get("/users/:id", getUserById);
// update a specific user information 
router.patch("/users/:id", updateUser);
// delete a specific user information 
router.delete("/users/:id", deleteUser);

module.exports = router;
