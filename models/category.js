const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true,
  },
  admin_id: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'Admin', 
  },
  
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;