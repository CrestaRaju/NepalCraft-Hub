const jwt = require('jsonwebtoken');
const { User } = require('../models');

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.userRole === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Require Admin Role!' });
  }
};

const isSeller = (req, res, next) => {
  if (req.userRole === 'seller' || req.userRole === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Require Seller Role!' });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isSeller
};
