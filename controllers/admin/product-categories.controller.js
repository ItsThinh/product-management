const ProductCategory = require('../../models/productCategory.model');
const createTreeHelper = require('../../helpers/createTree');
const systemConfig = require('../../config/system');

// [GET] /admin/product-categories/index
module.exports.index = async (req, res) => {

    const find = {
        deleted: false
    };

    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);

    res.render('admin/pages/product-categories/index', {
        records: newRecords
    });
};

// [GET] /admin/product-categories/create
module.exports.create = async (req, res) => {

    const find = {
        deleted: false
    };

    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.tree(records);

    res.render('admin/pages/product-categories/create', {
        pageTitle: 'Thêm danh mục sản phẩm',
        records: newRecords
    });
};

// [POST] /admin/product-categories/create
module.exports.createPost = async (req, res) => {
    if (req.body.position == '') {
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/product-categories`);
};
