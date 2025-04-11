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
  googleLogin,
  requestResetPassword,
  resetPassword,
} = require("../controllers/authControllers");
const { checkAccountLock } = require("../middlewares/authMiddleware");

// user sign up or create a new account 
router.post("/signup", registerUser);

// user logout
router.post("/signout", signout);

// user login 
router.post("/signin",checkAccountLock,loginUser);

// New route to check lockout status
// router.post("/check-lockout", checkLockoutStatus);

// google login api 
router.post("/google-login", googleLogin);

// get all users information 
router.get("/users", getUsers);
// get a specif user information
router.get("/users/:id", getUserById);
// update a specific user information 
router.patch("/users/:id", updateUser);
// delete a specific user information 
router.delete("/users/:id", deleteUser);

// Password Reset (2 APIs)
// a. Request Reset (POST /request-password-reset)
router.post("/request-password-reset", requestResetPassword)

// b. Reset Password (POST /reset-password)
router.post("/reset-password", resetPassword)


module.exports = router;
