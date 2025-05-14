const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Input verification
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check user existence
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }    

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h' 
    });

    res.status(201).json({ token, user: { id: user._id, username, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  // Verify input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Search for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT（according to rememberMe）
    const expiresIn = rememberMe ? '7d' : '1h';
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn
    });

    res.json({ token, user: { id: user._id, username: user.username, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token（实际需存储到数据库并设置过期时间）
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m'
    });

    // TODO: Send reset email（need Nodemailer）
    console.log(`Reset link: /reset-password?token=${resetToken}`);

    res.json({ message: 'Password reset link sent (check console)' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (!token || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Token, password, and confirmPassword are required' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    // Verfiy token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Reset token has expired' });
    }
    res.status(500).json({ message: err.message });
  }
};
