const bcrypt = require("bcrypt");
const User = require("../models/usersModels");
const jwt = require("jsonwebtoken");
const { signupSchema, signInSchema } = require("../middlewares/validator");

//  (Register)
const registerUser = async (req, res) => {
  const { email, password } = req.body;
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

//login (Authentication)
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signInSchema.validate({ email, password });
    if (error) {
      return res.status(401).send({ message: error.details[0].message });
    }
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).send({ message: "Invalid email address" });

    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) return res.status(401).send({ message: "Invalid password" });

    // const token = jwt.sign(
    //   { id: user._id, email: user.email, verified: user.verified },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "7h" }
    // );
    // res
    //   .cookie("Authorization", "Bearer" + token, {
    //     expires: new Date(Date.now() + 8 * 3600000),
    //     httpOnly: process.env.NODE_ENV === "production",
    //     secure: process.env.NODE_ENV === "production",
    //   })
    //   .send({ success: true, message: "Login successful", token });


    const userData = {
      id: user._id,
      email: user.email,
    };

    res.json(userData);
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
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




// a Request Reset (POST /request-password-reset)

const requestResetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  user.resetToken = hashedToken;
  user.resetTokenExpire = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetLink = `http://localhost:3000/reset-password?token=${token}&email=${email}`;
  // const resetLink = `https://online-resume-builder-omega.vercel.app/reset-password?token=${token}&email=${email}`;
  sendEmail(user.email, "Reset Password", resetLink);
  res.json({ message: "Reset link sent" });
}

// b. Reset Password (POST /reset-password) 

const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    email,
    resetToken: hashedToken,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(newPassword, 12);
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
}

module.exports = {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  signout,
  googleLogin,
  requestResetPassword,
  resetPassword
};
