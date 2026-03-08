const ProductCategory = require('../../models/productCategory.model');
const createTreeHelper = require('../../helpers/createTree');

module.exports.category = async (req, res, next) => {

    const categories = await ProductCategory.find({ deleted: false });
    categoryTree = createTreeHelper.tree(categories);

    res.locals.layoutProductCategory = categoryTree;

    next();
}