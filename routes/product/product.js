const express = require('express');
const Product = require('../../models/product');
const verifyToken = require('../../middleWare/verifyAuth'); 
const router = express.Router();

router.get('/products', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, admin_id } = req.query;
    if (!admin_id) {
      return res.status(400).json({ error: 'Admin ID is required' });
    }

    const products = await Product.find({ admin_id })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('category');

    const totalProducts = await Product.countDocuments({ admin_id });
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



router.post('/product/create', verifyToken, async (req, res) => {
    const { name, description, price, category, color, admin_id } = req.body;
  
    try {
      const newProduct = new Product({
        name,
        description,
        price,
        category,
        color,
        admin_id, 
      });
  
      await newProduct.save(); 
  
      res.status(201).json({
        message: 'Product created successfully!',
        product: newProduct,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating product' });
    }
  });
//  get by its category
router.get('/products/by-category', verifyToken, async (req, res) => {
  try {
    const { category_id, page = 1, limit = 10, admin_id } = req.query;

    
    if (!category_id || category_id === 'No+categories+available') {
      return res.status(400).json({ error: 'Valid category is required' });
    }

    if (!admin_id) {
      return res.status(400).json({ error: 'Admin ID is required' });
    }

    const products = await Product.find({ category_id, admin_id })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('category'); 

    const totalProducts = await Product.countDocuments({ category, admin_id });

    res.json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});



  router.get('/product/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Error fetching product' });
    }
  });

  router.put('/product/edit/:id', verifyToken, async (req, res) => {
    const { id } = req.params; 
    const { name, description, price, category, color } = req.body;
  
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, description, price, category, color }, 
        { new: true} 
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json({
        message: 'Product updated successfully',
        product: updatedProduct,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Error updating product', error });
    }
  });

  router.delete('/product/delete/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
  
    try {
      const product = await Product.findByIdAndDelete(id);
    
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Error deleting product' });
    }
  });
  
  
  module.exports = router;


