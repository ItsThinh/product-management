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

// [GET] /edit/:id
module.exports.edit = async (req, res) => {

    const record = await ProductCategory.findOne({
        _id: req.params.id,
        deleted: false
    });

    const records = await ProductCategory.find({
        deleted: false
    });
    const newRecords = createTreeHelper.tree(records);

    console.log(record);
    res.render('admin/pages/product-categories/edit.pug', {
        pageTitle: 'Trang chỉnh sửa danh mục',
        record: record,
        records: newRecords
    });
}

// [PATCH] /edit/:id
module.exports.editPost = async(req, res) => {
    
    try {

        const oldRecord = await ProductCategory.findOne({ _id: req.params.id });
        const oldPosition = oldRecord.position;

        if (req.body.position === '') {
            req.body.position = oldPosition;
        } else {
            req.body.position = parseInt(req.body.position);
        }

        await ProductCategory.updateOne({ _id: req.params.id }, req.body);

        res.redirect(`${systemConfig.prefixAdmin}/product-categories`);
    } catch(e) {
        res.redirect(req.get('Referer') || '/');
    }
}