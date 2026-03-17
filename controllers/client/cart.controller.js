const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');
const productHelper = require('../../helpers/product');

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {

    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = req.body.quantity;

    // Tạo sẵn item để lưu vào db
    const cartObject = {
        product_id: productId,
        quantity: quantity
    };

    try {

        // Kiểm tra sản phẩm đã có trong giỏ hàng hay chưa
        // nếu có rồi thì tăng số lượng, nếu chưa thì thêm sản phẩm vào giỏ hàng
        const cart = await Cart.findOne({ _id: cartId });
        const productExist = cart.products.find(item => item.product_id == productId);
        
        await Product.updateOne(
            { _id: cartObject.product_id },
            { $inc: { stock: -cartObject.quantity } }
        );
        
        if (productExist) {
            await Cart.updateOne(
                { 
                    _id: cartId,
                    'products.product_id': productId
                },
                { $inc: { 'products.$.quantity': quantity } }
            );
        } else {
            await Cart.updateOne(
                { _id: cartId },
                { $push: { products: cartObject } }
            )
        }
        
        req.flash('success', 'Thêm vào giỏ hàng thành công');

    } catch(e) {
        console.log(e);
        req.flash('error', 'Không thể thêm vào giỏ hàng');
    }
    
    res.redirect(req.get('Referer') || '/');
}

// [GET] /cart/
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

    res.render('client/pages/cart/index', {
        pageTitle: 'Giỏ hàng',
        products: cartItems,
        total: total
    });
}

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    const productId = req.params.productId;

    await Cart.updateOne(
        { _id: req.cookies.cartId },
        { $pull: { products: { product_id: productId } } }
    );

    res.redirect(req.get('Referer'));
}

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.params.quantity);

    console.log(productId);
    console.log(quantity);

    await Cart.updateOne(
        { 
            _id: req.cookies.cartId,
            'products.product_id': productId
        },
        {
            $set: { 'products.$.quantity': quantity }
        }
    )

    res.redirect(req.get('Referer'));
}