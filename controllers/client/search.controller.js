const Product = require('../../models/product.model');
const productHelper = require('../../helpers/product');

// [GET] /search
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;

    let newProducts = [];

    if (keyword) {
        const regex = RegExp(keyword, 'i');
        const products = await Product.find({
            title: regex,
            deleted: false,
            status: 'active'
        }).lean();

        newProducts = productHelper.addFinalPrice(products);
    }

    res.render('client/pages/search/index.pug', {
        pageTitle: `Kết quả tìm kiếm: ${keyword}`,
        products: newProducts
    });
    
}