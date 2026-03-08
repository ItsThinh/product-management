const Product = require("../../models/product.model");
const productHelper = require('../../helpers/product');

// [GET] /products
module.exports.index = async (req, res) => {

    const products = await Product
    .find({
        status: "active",
        deleted: false
    })
    .sort({ position: 'desc' });

    const newProducts = productHelper.addFinalPrice(products);

    res.render("client/pages/products/index", {
        pageTitle: "Trang sản phẩm",
        products: newProducts
    });
};


// [GET] products/:slug
module.exports.detail = async (req, res) => {

    const find = {
        deleted: false,
        status: 'active',
        slug: req.params.slug
    };
    const product = await Product.findOne(find);
    console.log(product);
    
    res.render('client/pages/products/detail', {
        product: product
    });
}