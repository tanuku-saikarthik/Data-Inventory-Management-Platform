import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import dotenv from 'dotenv';
// Ensure you import your middleware for protected routes
import authenticate from '../middleware/authMidddleware.js'; 

const router = express.Router();
dotenv.config();
// Register
// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body; // Make sure to include name if required

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered', userId: user._id, token });
    // Send userId or any other relevant info
  } catch (error) {
    console.error('Registration error:', error); // Log the error for debugging
    res.status(500).json({ error: 'Server error' });
  }
});


// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      console.error('Login error:', error); // Log the error for debugging
      res.status(500).json({ error: 'Server error' });
    }
  });


  router.get("/me", authenticate
, async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password"); // Exclude password for security
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
// Protected route
export default router;
