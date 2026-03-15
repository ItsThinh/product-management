const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

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