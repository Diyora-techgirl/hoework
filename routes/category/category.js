const express = require('express');
const Category = require('../../models/category');
const verifyToken = require('../../middleWare/verifyAuth'); 
const router = express.Router();

router.post("/create", verifyToken, async (req, res) => {
  try {
    const { name, admin_id } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const category = new Category({ name , admin_id});
    await category.save();

    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Category name must be unique" });
    }
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


router.get("/all", verifyToken, async (req, res) => {
  try {
    const { admin_id, page = 1, limit = 10 } = req.query;
    if (!admin_id) {
      return res.status(400).json({ error: 'Admin ID is required' });
    }

   
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({ error: 'Invalid page number' });
    }
    if (isNaN(limitNumber) || limitNumber < 1) {
      return res.status(400).json({ error: 'Invalid limit value' });
    }

    
    const categories = await Category.find({ admin_id })
      .skip((pageNumber - 1) * limitNumber) 
      .limit(limitNumber) 
      .sort("name");

   
    const totalCategories = await Category.countDocuments({ admin_id });

    res.status(200).json({
      categories,
      totalCategories,
      totalPages: Math.ceil(totalCategories / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/view/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


router.put("/edit/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Category name must be unique" });
    }
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;