const bcrypt = require("bcrypt");
const User = require("../models/usersModels");
const jwt = require("jsonwebtoken");
const { signupSchema, signInSchema } = require("../middlewares/validator");
const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION = 1 * 60 * 1000; // 15 minutes in milliseconds

//  (Register)
const registerUser = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email , password)
  try {
    const { error } = signupSchema.validate({ email, password });
    if (error) {
      return res.status(401).send({ message: error.details[0].message });
    }
    let user = await User.findOne({ email });
    if (user) return res.status(400).send({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    user = new User({ email, password: hashedPassword });

    const result = await user.save();
    res.status(201).send({ message: "User registered successfully", result });
  } catch (error) {
    res.status(500).send({ message: "Server Error", error });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
     // Validate input
     const { error } = signInSchema.validate({ email, password });
     if (error) {
       return res.status(400).json({
         error: error.details[0].message,
         remainingAttempts: MAX_FAILED_ATTEMPTS,
         isLocked: false
       });
     }

     const userEmail = await User.findOne({ email });
     if (!userEmail) return res.status(400).send({ message: "User Can't Signup yet Please SignUp first" });
    
     // Find user and explicitly select the password field
    const user = await User.findOne({ email }).select('+password +failedLoginAttempts +isLocked +lockUntil');

   

    // Always return current lock status even for invalid users
    const responseData = {
      isLocked: user?.isLocked || false,
      lockUntil: user?.lockUntil || null,
      remainingAttempts: user ? MAX_FAILED_ATTEMPTS - (user.failedLoginAttempts || 0) : MAX_FAILED_ATTEMPTS
    };

    if (!user) {
      return res.status(401).json({
        ...responseData,
        error: "Invalid credentials"
      });
    };

    // Check account lock
    if (user.isLocked && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000); // Minutes
      return res.status(403).json({
        error: `Account locked. Try again in ${remainingTime} minutes`,
        lockoutTime: user.lockUntil.toISOString(),
        isLocked: true,
        remainingAttempts: 0 // Explicitly set to 0 when locked
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.isLocked = true;
        user.lockUntil = new Date(Date.now() + LOCKOUT_DURATION);
      }

      await user.save();

      return res.status(401).json({
        error: `Invalid password. ${MAX_FAILED_ATTEMPTS - user.failedLoginAttempts} attempts remaining`,
        remainingAttempts: MAX_FAILED_ATTEMPTS - user.failedLoginAttempts,
        isLocked: user.isLocked,
        lockoutTime: user.isLocked ? user.lockUntil.toISOString() : null
      });
    }

    // Successful login
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockUntil = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, verified: user.verified },
      process.env.JWT_SECRET,
      { expiresIn: "7h" }
    );

    
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: "Server error",
      isLocked: false,
      remainingAttempts: null
    });
  }
};

// signout user

const signout = async (req, res) => {
  res
    .clearCookie("Authorization")
    .status(400)
    .send({ success: true, message: "user logout successfully" });
};

const googleLogin = async (req, res) => {
  const { email, name } = req.body;
  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, name });
      await user.save();
    }

    res.status(200).send({ success: true, user });
  } catch (error) {
    res.status(500).send({ message: "Server Error", error });
  }
};

// (GET)
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
};

// (GET by ID)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: "User not found" });

    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
};

//  (PUT)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: "User not found" });

    const { name, email } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.send({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
};

//  (DELETE)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: "User not found" });

    await user.deleteOne();
    res.send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
};

// chack lockout status

const checkLockoutStatus = async (req, res) => {
  // console.log("Check lockout called with:", req.body);
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        remainingAttempts: MAX_FAILED_ATTEMPTS,
        isLocked: false,
        lockUntil: null,
      });
    }

    const remainingAttempts = MAX_FAILED_ATTEMPTS - user.failedLoginAttempts;
    const isLocked = user.isLocked && user.lockUntil > Date.now();
    const lockUntil = isLocked ? user.lockUntil.toISOString() : null;

    return res.status(200).json({
      success: true,
      remainingAttempts: remainingAttempts > 0 ? remainingAttempts : 0,
      isLocked,
      lockUntil,
    });
  } catch (error) {
    console.error("Check lockout error:", error);
    return res.status(500).json({
      error: "Server error",
    }); 
    
  }
};

module.exports = {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  signout,
  googleLogin,
  checkLockoutStatus, // Add this to exports
};
