const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');
const Order = require('../../models/order.model');
const productHelper = require('../../helpers/product');

// [GET] /
module.exports.index = async (req, res) => {
    const cart = await Cart.findOne({ _id: req.cookies.cartId }).select('products').lean();

    const productIds = cart.products.map(item => item.product_id);

    const products = await Product.find(
        { _id: { $in: productIds }}
    ).lean();

    // Dùng map để lưu cặp id - quantity để lát nữa dùng cho việc gán quantity theo id của các product
    const quantityMap = new Map(
        cart.products.map(item => [item.product_id.toString(), item.quantity])
    );

    const cartItems = productHelper.addFinalPrice(products)
        .map(item => {
            const quantity = quantityMap.get(item._id.toString()) || 0;
            return {
                ...item,
                quantity: quantity,
                total: item.newPrice * quantity
            }
        }
    );

    const total = cartItems.reduce((sum, item) => sum + item.newPrice * item.quantity, 0);

    res.render('client/pages/checkout/index', {
        pageTitle: 'Đặt hàng',
        products: cartItems,
        total: total
    });
};

// [POST] /order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = {
        fullName: req.body.fullName,
        phone: parseInt(req.body.phone),
        address: req.body.address
    };

    const cart = await Cart.findOne({ _id: cartId });
    const productIds = cart.products.map(item => item.product_id);
  
    const products = await Product.find(
        { _id: { $in: productIds } }
    );

    const quantityMap = new Map(
        cart.products.map(item => [item.product_id.toString(), item.quantity])
    );

    const cartItems = productHelper.addFinalPrice(products)
        .map(item => {
            return {
                product_id: item._id.toString(),
                price: item.price,
                discountPercentage: item.discountPercentage,
                quantity: quantityMap.get(item._id.toString())
            }
    });

    const orderInfo = {
        cart_id: cartId,
        userInfo: userInfo,
        products: cartItems
    }

    const order = new Order(orderInfo);
    await order.save();

    await Cart.updateOne(
        { _id: cartId },
        { $set: { products: [] } }
    );

    res.redirect(`/checkout/success/${order._id.toString()}`);
};

// [GET] checkout/success/:orderId
module.exports.success = async (req, res) => {
    const order = await Order.findOne({ _id: req.params.orderId });
    res.render('client/pages/checkout/success.pug',{
        order: order   
    });
}