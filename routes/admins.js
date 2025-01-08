const express = require('express')
const jwt = require('jsonwebtoken');
const Admin = require("../models/admin");
const router = express.Router();
require('dotenv').config();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
      console.log('Login attempt:', { email, password }); // Debugging

      const user = await User.findOne({ email });
      if (!user) {
          console.log('User not found');
          return res.status(400).json({ message: "Invalid email or password" });
      }

      const isPasswordMatch = await user.comparePassword(password);
      console.log(`Password match result: ${isPasswordMatch}`); // Debugging

      if (!isPasswordMatch) {
          return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
          { id: user._id, password: user.password },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );
      res.status(200).json({ message: "Login successful", token });
  } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: "Error logging in user", error });
  }
});


  router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const newUser = new User({ name, email, password }); 
        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error registering user", error });
    }
});
  
  
  module.exports = router;