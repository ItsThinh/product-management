const Product = require('../../models/product.model');
const ProductCategory = require('../../models/productCategory.model');
const Account = require('../../models/account.model');
const createTreeHelper = require('../../helpers/createTree');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const paginationHelper = require('../../helpers/pagination');

const systemConfig = require('../../config/system');

// [GET] /admin/products
module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.query);

    const objectSearch = searchHelper(req.query);

    const find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    // Pagination

    const totalProduct = await Product.countDocuments(find);
    // Phải await vì countDocuments trả về Promise; nếu không, totalProduct sẽ là Promise chứ không phải number

    let paginationObject = paginationHelper(
        {
            currentPage: 1,
            limit: 4
        }, 
        req.query,
        totalProduct
    );

    // End Pagination

    // Sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
        console.log(sort);
    } else {
        sort.position = 'desc';
    }
    
    // End Sort

    const products = await Product
    .find(find)
    .limit(paginationObject.limit)
    .skip(paginationObject.skip)
    .sort(sort);

    // Created, Updated By

    // Cách 1, phải query nhiều lần trong vòng lặp
    // for (const product of products) {
    //     if (product.createdBy) {
    //         const createdUser = await Account.findOne({ _id: product.createdBy.account_id });
    //         if (createdUser) {
    //             product.createdByFullName = createdUser.fullName;
    //         }
    //     }

    //     if (product.updatedBy && product.updatedBy.length > 0) {
    //         const lastUpdatedUser = await Account.findOne({ _id: product.updatedBy.at(-1).account_id });
    //         if (lastUpdatedUser) {
    //             product.lastUpdatedByFullName = lastUpdatedUser.fullName
    //             product.lastUpdateTime = product.updatedBy.at(-1).updatedAt;
    //         }
    //     }  
    // }

    // Cách 2 tối ưu lại số lần query thành 1 lần là query Account
    // Ngăn gặp phải lỗi n+1 query
    const accountIdSet = new Set();
    for (const product of products) {
        if (product.createdBy.account_id) 
            accountIdSet.add(product.createdBy.account_id);

        if (product.updatedBy && product.updatedBy.length > 0) 
            accountIdSet.add(product.updatedBy.at(-1).account_id);
    }

    const accounts = await Account
        .find(
            {
                _id: { $in: Array.from(accountIdSet) }
            }
        )
        .select('_id fullName')
        .lean()
    ;
    
    const accountIdMap = new Map();

    for (const account of accounts) {
        accountIdMap.set(account._id.toString(), account.fullName);
    }

    for (const product of products) {
        if (product.createdBy.account_id) 
            product.createdByFullName = accountIdMap.get(product.createdBy.account_id);

        if (product.updatedBy && product.updatedBy.length > 0) {
            product.lastUpdatedByFullName = accountIdMap.get(product.updatedBy.at(-1).account_id);
            product.lastUpdateTime = product.updatedBy.at(-1).updatedAt;
        }
    }

    // Created, Updated by

    res.render('admin/pages/products/index', {
        pageTitle: "Quản lý danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        paginationObject: paginationObject
    });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    };

    const id = req.params.id;
    const statusChange = req.params.status;
    await Product.updateOne(
        { _id: id },
        { 
            status: statusChange,
            $push: { updatedBy: updatedBy }
        }
    );
    
    res.redirect(req.get('Referrer') || '/');
    // res.redirect('back') đã bị loại bỏ ở Express 5
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(', ');

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    };

    switch (type) {
        case 'active':
            await Product.updateMany(
                { _id: { $in: ids }},
                { 
                    status: 'active',
                    $push: { updatedBy: updatedBy }
                }
            );
            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công`);
            break;
        case 'inactive':
            await Product.updateMany(
                { _id: { $in: ids }},
                { 
                    status: 'inactive',
                    $push: { updatedBy: updatedBy }
                }
            );
            req.flash('success', `Cập nhật trạng thái ${ids.length} sản phẩm thành công`);
            break;
        case 'delete-all':
            await Product.updateMany(
                { _id: { $in: ids }},
                { 
                    deleted: true,
                    deletedBy: {
                        account_id: res.locals.user.id,
                        deletedAt: new Date()
                    }
                }
            );
            req.flash('success', `Xóa ${ids.length} sản phẩm thành công`);
            break;
        case 'change-position':
            for (const item of ids) {
                const [id, position] = item.split('-');
                await Product.updateOne(
                    { _id: id },
                    { 
                        position: parseInt(position),
                        $push: { updatedBy: updatedBy }
                    }
                );
            }
            req.flash('success', `Cập nhật vị trí ${ids.length} sản phẩm thành công`);
            break;
    }
    res.redirect(req.get('Referrer') || '/');
};

// [DELETE] /admin/products/delete-item/:id
module.exports.deleteItem = async (req, res) => {
    const productId = req.params.id;
    // await Product.deleteOne({ _id: productId }); // hard delete
    await Product.updateOne(
        { _id: productId },
        { 
            deleted: true, 
            deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: new Date()
            }
        }
    ); // soft delete
    req.flash('success', `Xóa sản phẩm thành công`);
    res.redirect(req.get('Referrer') || '/');
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    const categories = await ProductCategory.find({
        deleted: false
    });
    const categoryTree = createTreeHelper.tree(categories);
    
    res.render('admin/pages/products/create', {
        pageTitle: 'Thêm mới sản phẩm',
        categories: categoryTree
    });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position == '') {
        const count = await Product.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    req.body.createBy = {
        account_id: res.locals.user.id
    };
    
    const product = new Product(req.body);
    await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {

    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const product = await Product.findOne(find);

        const productCategory = await ProductCategory.find({
            deleted: false
        });
        const categoryTree = createTreeHelper.tree(productCategory);

        res.render('admin/pages/products/edit', {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            categories: categoryTree
        });
    } catch (error) {
        console.log(error);
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {

    req.body.price = parseFloat(req.body.price);
    req.body.discountPercentage = parseFloat(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    };

    try {
        await Product.updateOne(
            { 
                _id: req.params.id 
            },
            {
                $set: { ...req.body },
                $push: { updatedBy: updatedBy }
            }
        );

        req.flash('success', 'Cập nhật thành công');
    } catch (error) {
        req.flash('error', 'Cập nhật thất bại');
    }

    console.log(req.body);
    res.redirect(req.get('Referrer') || '/');
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {

    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const product = await Product.findOne(find);

        res.render('admin/pages/products/detail', {
        product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};