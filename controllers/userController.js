const User = require("../models/user");

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getUsers };
