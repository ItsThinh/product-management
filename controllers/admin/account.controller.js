const Account = require('../../models/account.model');
const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');
const md5 = require('md5');

// [GET] admin/accounts/
module.exports.index = async (req, res) => {

    const records = await Account.find({ deleted: false }).select('-password -token');
    
    for (const record of records) {
        const role = await Role.findOne(
            {
                _id: record.role_id,
                deleted: false 
            }
        );
        record.role = role;
    }

    res.render('admin/pages/accounts/index', 
        {
            pageTitle: 'Danh sách tài khoản',
            records: records
        }
    );
}

// [GET] admin/accounts/create
module.exports.create = async (req, res) => {

    const roles = await Role.find({ deleted: false });

    res.render('admin/pages/accounts/create', 
        {
            pageTitle: 'Tạo tài khoản mới',
            roles: roles
        }
    );
}

// [POST] admin/accounts/create
module.exports.createPost = async (req, res) => {

    const emailExist = await Account.findOne(
        {
            email: req.body.email,
            deleted: false
        }
    );

    if (emailExist) {
        
        req.flash('error', `Email ${req.body.email} đã tồn tại`);
        res.redirect(req.get('Referer') || '/');
    } else {
        req.body.password = md5(req.body.password);
        const newRecord = new Account(req.body);
        await newRecord.save();

        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
    
}

// [GET] admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {

        const record = await Account.findOne(
            {
                _id: req.params.id,
                deleted: false
            }
        ).select('-password -token');

        const roles = await Role.find({ deleted: false });
        
        res.render('admin/pages/accounts/edit', 
            {
                pageTitle: 'Chỉnh sửa tài khoản',
                record: record,
                roles: roles
            }
        )
    } catch (error) {
        console.log(error);
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

// [PATCH] admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    const emailExist = await Account.findOne(
        {
            _id: { $ne: id },
            email: req.body.email,
            deleted: false
        }
    );
    console.log(emailExist);
    if (emailExist) {
        req.flash('error', `Email ${req.body.email} đã tồn tại`);
        res.redirect(req.get('Referer') || '/');
        return;
    } else {

        const updateRecord = {
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            avatar: req.body.avatar,
            role: req.body.role_id,
            status: req.body.status
        };

        if (req.body.password && req.body.password.trim() != '') {
            updateRecord.password = md5(req.body.password);
        }
        
        await Account.updateOne({ _id: id }, updateRecord);
        req.flash('success', 'Cập nhật tài khoản thành công');
        res.redirect(req.get('Referer') || '/');
    }

    
}