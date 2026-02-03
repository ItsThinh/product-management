const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {

    const products = await Product
    .find({
        status: "active",
        deleted: false
    })
    .sort({ position: 'desc' });

    const newProducts = products.map(item => {
        const newPrice = Math.floor((item.price - item.discountPercentage / 100 * item.price) * 100) / 100;
        item.newPrice = newPrice.toFixed(2);
        return item;
    });

    res.render("client/pages/products/index", {
        pageTitle: "Trang sản phẩm",
        products: newProducts
    });
}