import jwt from 'jsonwebtoken';

const authVerify = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store user ID
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authVerify;