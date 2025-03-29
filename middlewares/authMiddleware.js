const User = require("../models/usersModels");

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};

// Middleware to check account lock status  //new new
const checkAccountLock = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    
    if (user && user.isLocked && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(403).json({
        error: `Account locked. Try again in ${remainingTime} minutes`,
        lockoutTime: user.lockUntil, // Add this
        isLocked: true // Add this
      });
    }
    
    next();
  };

// module.exports = authMiddleware, checkAccountLock;
// new
// Export as separate named exports
module.exports = {
    authMiddleware,
    checkAccountLock
};
