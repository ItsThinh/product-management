const Account = require('../../models/account.model');
const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');

// [GET] admin/my-account/
module.exports.index = async (req, res) => {
    const roleId = res.locals.user.role_id;
    const role = await Role.findOne({ _id: roleId }).select('title')
    res.locals.user.roleTitle = role.title;
    res.render('admin/pages/my-account/index');
}

// [GET] admin/my-account/edit/
module.exports.edit = (req, res) => {
    res.render('admin/pages/my-account/edit');
}

// [PATCH] admin/my-account/edit/
module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id;

    const emailExist = await Account.findOne(
        {
            _id: { $ne: id },
            email: req.body.email,
            deleted: false
        }
    );

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
            role_id: req.body.role_id,
            status: req.body.status
        };

        if (req.body.password && req.body.password.trim() != '') {
            updateRecord.password = md5(req.body.password);
        }

        await Account.updateOne({ _id: id }, updateRecord);
        req.flash('success', 'Cập nhật tài khoản thành công');
        res.redirect(`${systemConfig.prefixAdmin}/my-account`);
    }
}