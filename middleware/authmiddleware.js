const jwt = require('jsonwebtoken');
const secretKey = 'parijigento';

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers['Authorization'];
  
  if (!authHeader) {
    return res.status(403).send({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    return res.status(403).send({ message: 'Token format is invalid' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to authenticate token' });
    }

    req.user = decoded;
    next();
  });
};

exports.authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send({ message: 'Unauthorized' });
    }
    next();
  };
};
