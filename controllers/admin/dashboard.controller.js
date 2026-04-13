const ProductCategory = require('../../models/productCategory.model');
const Product = require('../../models/product.model');
const Account = require('../../models/account.model');
const User = require('../../models/user.model');

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {

    const getStatsForModel = async (Model) => {
        const stats = await Model.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1},
                    active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
                    inactive: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
                    deleted: { $sum: { $cond: [{ $eq: ['$deleted', true] }, 1, 0] } }
                }
            }
        ]);

        return stats[0] || { total: 0, active: 0, inactive: 0, deleted: 0 };
    };

    const [productCategory, product, account, user] = await Promise.all([
        getStatsForModel(ProductCategory),
        getStatsForModel(Product),
        getStatsForModel(Account),
        getStatsForModel(User),
    ]);

    const statistics = {
        productCategory,
        product,
        account,
        user
    }
    
    res.render('admin/pages/dashboard/index', {
        pageTitle: "Trang tổng quan",
        statistics: statistics
    });
};