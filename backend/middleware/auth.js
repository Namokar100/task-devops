const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const userId = req.cookies.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.userId = userId;
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = auth;