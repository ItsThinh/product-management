const dashboardRoutes = require('./dashboard.route');
const adminProductRoutes = require('./product.route');
const productCategoriesRoutes = require('./product-categories.route');
const roleRoutes = require('./role.route');
const accountRoutes = require('./account.route');
const authRoutes = require('./auth.route');
const myAccountRoutes = require('./my-account.route');
const settingsRoutes = require('./setting.route');

const systemConfig = require('../../config/system');
const authMiddleware = require('../../middlewares/admin/auth.middleware');

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(
        PATH_ADMIN + '/dashboard',
        authMiddleware.requireAuth,
        dashboardRoutes
    );

    app.use(PATH_ADMIN + '/products', authMiddleware.requireAuth, adminProductRoutes);
    app.use(PATH_ADMIN + '/product-categories', authMiddleware.requireAuth, productCategoriesRoutes);
    app.use(PATH_ADMIN + '/roles', authMiddleware.requireAuth, roleRoutes);
    app.use(PATH_ADMIN + '/accounts', authMiddleware.requireAuth, accountRoutes);
    app.use(PATH_ADMIN + '/auth', authRoutes);
    app.use(PATH_ADMIN + '/my-account', authMiddleware.requireAuth, myAccountRoutes);
    app.use(PATH_ADMIN + '/settings', authMiddleware.requireAuth, settingsRoutes);


};