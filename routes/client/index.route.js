const homeRoutes = require('./home.route');
const productRoutes = require('./product.route');

module.exports = (app) => {

    app.use('/', homeRoutes);
    // Mọi request bắt đầu bằng / thì chuyển cho homeRoutes

    app.use('/products', productRoutes);
    // Mọi request bắt đầu bằng /products thì chuyển cho productRoutes
}