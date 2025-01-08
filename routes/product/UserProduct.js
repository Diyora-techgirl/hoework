const express = require('express');
const Product = require('../../models/product');
const verifyToken = require('../../middleWare/verifyAuth'); 
const router = express.Router();


router.get('/products', verifyToken, async (req, res) => {
    try {
      const { page = 1, limit = 10, } = req.query;
      const products = await Product.find()
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate('category');
  
      const totalProducts = await Product.countDocuments();
      res.json({
        products,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  module.exports = router;