const Product = require('../../models/product.model');
const productHelper = require('../../helpers/product');

// [GET] /
module.exports.index = async (req, res) => {

    const productsFeatured = await Product.find({
            deleted: false,
            status: 'active',
            featured: '1'
    });
    const newProductsFeatured = productHelper.addFinalPrice(productsFeatured);

    const productsNew = await Product.find({
            deleted: false,
            status: 'active'
    }).sort({ position: 'desc' }).limit(6);
    const newProductsNew = productHelper.addFinalPrice(productsNew);

    res.render('client/pages/home/index', {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    });
};