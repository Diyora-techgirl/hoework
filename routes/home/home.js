const express = require('express')
const User = require("../models/user");
const router = express.Router();


router.get('/home', verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      const isNewUser = user.firstLogin === true; 
      const welcomeMessage = isNewUser
        ? `Welcome new user - ${user.username}`
        : `Welcome back - ${user.username}`;
  
      res.status(200).json({ message: welcomeMessage });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  module.exports = router;