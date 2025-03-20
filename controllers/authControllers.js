const bcrypt = require("bcrypt");
const User = require("../models/usersModels");
const jwt = require("jsonwebtoken");
const { signupSchema } = require("../middlewares/validator");

//  (Register)
const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error } = signupSchema.validate({email, password});
    if(error){
      return res.status(401).send({ message : error.details[0].message})
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

//login (Authentication)
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).send({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).send({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
};

module.exports = {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
};
