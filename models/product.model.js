const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  title: String,
  slug: {
    type: String,
    slug: 'title',
    unique: true
  },
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
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

const Product = mongoose.model("Product", productSchema, 'products');

module.exports = Product;