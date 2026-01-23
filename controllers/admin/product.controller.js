const Product = require('../../models/product.model');



module.exports.index = async (req, res) => {

    const filterButtons = [
        {
            name: "Tất cả",
            status: '',
            class: ''
        },
        {
            name: "Hoạt động",
            status: 'active',
            class: ''
        },
        {
            name: "Dừng hoạt động",
            status: 'inactive',
            class: ''
        }
    ];

    const find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;

        const index = filterButtons.findIndex(item => item.status === find.status);
        filterButtons[index].class = 'active';
    } else {
        const index = filterButtons.findIndex(item => item.status === '');
        filterButtons[index].class = 'active';
    }

    const products = await Product.find(find);

    res.render('admin/pages/products/index', {
        pageTitle: "Quản lý danh sách sản phẩm",
        products: products,
        filterButtons: filterButtons
    });
}