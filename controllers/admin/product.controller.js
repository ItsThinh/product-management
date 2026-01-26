const Product = require('../../models/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');

module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query);

    const objectSearch = searchHelper(req.query);

    const find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    const products = await Product.find(find);

    res.render('admin/pages/products/index', {
        pageTitle: "Quản lý danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    });
}