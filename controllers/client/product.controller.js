const Product = require("../../models/product.model");
const ProductCategory = require('../../models/productCategory.model');
const productHelper = require('../../helpers/product');
const productCategoryHelper = require('../../helpers/product-category');

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
        pageTitle: 'Danh sách sản phẩm',
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

// [GET] products/:slugCategory
module.exports.category = async (req, res) => {

    const slug = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        status: 'active',
        deleted: false
    });

    const subs = await productCategoryHelper.getSubCategory(slug.id);
    
    const listCategoryId = subs.map(item => item.id);

    const products = await Product.find(
        {
            product_category_id: { $in: [slug.id, ...listCategoryId] },
            deleted: false,
            status: 'active'
        }
    ).sort({ position: 'desc' });

    const newProducts = productHelper.addFinalPrice(products);
    
    res.render('client/pages/products/index', {
        pageTitle: slug.title,
        products: newProducts
    });
}