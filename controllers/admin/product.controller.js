const Product = require('../../models/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');

module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query);

    const find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

    let keyword = '';
    if (req.query.keyword) {
        keyword = req.query.keyword.trim();
        find.title = new RegExp(keyword, 'i');
    }

    const products = await Product.find(find);

    res.render('admin/pages/products/index', {
        pageTitle: "Quản lý danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword
    });
}