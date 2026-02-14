const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  title: String,
  parent_id: {
    type: String,
    default: ''
  },
  slug: {
    type: String,
    slug: 'title',
    unique: true
  },
  description: String,
  thumbnail: String,
  status: String,
  deleted: {
    type: Boolean,
    default: false
  },
  position: Number,
  deletedAt: Date
}, {
  timestamps: true
});

const ProductCategory = mongoose.model("ProductCategory", productSchema, 'product-categories');

module.exports = ProductCategory;