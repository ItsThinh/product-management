const dashboardRoutes = require('./dashboard.route');
const adminProductRoutes = require('./product.route');
const productCategoriesRoutes = require('./product-categories.route');
const systemConfig = require('../../config/system');

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + '/dashboard', dashboardRoutes);
    app.use(PATH_ADMIN + '/products', adminProductRoutes);
    app.use(PATH_ADMIN + '/product-categories', productCategoriesRoutes);
};