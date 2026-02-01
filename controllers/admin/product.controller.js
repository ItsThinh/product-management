const Product = require('../../models/product.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');

// [GET] /admin/products
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

    // Pagination

    const totalProduct = await Product.countDocuments(find);
    // Phải await vì countDocuments trả về Promise; nếu không, totalProduct sẽ là Promise chứ không phải number

    let paginationObject = paginationHelper(
        {
            currentPage: 1,
            limit: 4
        }, 
        req.query,
        totalProduct
    );

    // End Pagination

    const products = await Product.find(find).limit(paginationObject.limit).skip(paginationObject.skip);

    res.render('admin/pages/products/index', {
        pageTitle: "Quản lý danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        paginationObject: paginationObject
    });
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {

    const id = req.params.id;
    const statusChange = req.params.status;
    await Product.updateOne({ _id: id}, { status: statusChange });
    res.redirect(req.get('Referrer') || '/');
    // res.redirect('back') đã bị loại bỏ ở Express 5
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(', ');

    switch (type) {
        case 'active':
            await Product.updateMany({ _id: { $in: ids }}, { status: 'active'});
            break;
        case 'inactive':
            await Product.updateMany({ _id: { $in: ids }}, { status: 'inactive'});
            break;
    }
    res.redirect(req.get('Referrer') || '/');
}