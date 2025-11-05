const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = header.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = payload;
    next();
  });
}

module.exports = {
  authenticateJWT,
};
