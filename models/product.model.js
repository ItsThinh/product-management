const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  deleted: Boolean,
  position: Number
});

const Product = mongoose.model("Product", productSchema, 'products');
// Tham số đầu tiên dùng cho ID nội bộ của mongoose, có thể đặt tùy ý nhưng nên đặt theo convention
// Ta đăng ký model "Product" vào mongoose.models
//
// Biến Product sẽ được sử dụng để thao tác với database tương ứng collection 'products'


module.exports = Product;