const mongoose = require('mongoose');
var slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  title: String,
  product_category_id: {
    type: String,
    default: ''
  },
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
  createdBy: {
    account_id: String,
    createdAt: {
      type: String,
      default: Date.now
    }
  },
  deleted: {
    type: Boolean,
    default: false
  },
  position: Number,
  deletedBy: {
    account_id: String,
    deletedAt: Date
  }
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema, 'products');

module.exports = Product;