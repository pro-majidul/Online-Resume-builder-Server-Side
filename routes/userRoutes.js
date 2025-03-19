const express = require("express");
const router = express.Router();
const { registerUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser } = require("../controllers/userController");


// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
