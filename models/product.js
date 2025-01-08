const mongoose = require('mongoose');
const Category = require('./category');
const Admin = require('./admin')
const productSchema = new mongoose.Schema({
  name: { 
    type: String,
     required: true 
    },
  description: { 
    type: String,
     required: true 
    },
  color: { 
    type: String,
     required: true
     },
  category: {
    type: String,
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Category', 
     required: true 
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'Admin', 
      },
  price: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);