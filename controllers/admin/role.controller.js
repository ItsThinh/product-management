const Role = require('../../models/role.model');

const systemConfig = require('../../config/system');
const { get } = require('mongoose');

// [GET] admin/roles
module.exports.index = async (req, res) => {
    const records = await Role.find({ deleted: false });
    res.render('admin/pages/roles/index', {
        records: records
    });
};

// [GET] admin/roles/create
module.exports.create = (req, res) => {
    res.render('admin/pages/roles/create', {
        pageTitle: "Thêm mới nhóm quyền"
    });
};

// [POST] admin/roles/create
module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    await record.save();
    req.flash('success', 'Thêm nhóm quyền thành công');
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] admin/edit/:id
module.exports.edit = async (req, res) => {

    try {
        const record = await Role.findOne(
            {
                _id: req.params.id,
                deleted: false
            }
        );
        res.render('admin/pages/roles/edit', {
            record: record
        });      
    } catch (e) {
        console.log(e);
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }

}

// [PATCH] admin/edit/:id
module.exports.editPatch = async (req, res) => {

    try {
        await Role.updateOne(
            { _id: req.params.id },
            { $set: req.body}
        );

        req.flash('success', `Đã cập nhật lại nhóm quyền [${req.body.title}] thành công`);
        res.redirect(`${systemConfig.prefixAdmin}/roles`);

    } catch (e) {
        console.log(e);
        req.flash('error', `Cập nhật nhóm quyền thất bại`);
        res.redirect(req.get('Referer') || '/');
    }

}

// [GET] admin/roles/permission
module.exports.permisssions = async (req, res) => {
    const records = await Role.find({ deleted: false });
    res.render('admin/pages/roles/permissions', {
        records: records
    });
}

// [PATCH] admin/roles/permission
module.exports.permissionsPatch = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);
    
    for (const item of permissions) {
        await Role.updateOne(
            { _id: item.id },
            { permissions: item.permissions }
        )
    }
    req.flash('success', 'Cập nhật phân quyền thành công');
    res.redirect(req.get('Referer') || '/');
}