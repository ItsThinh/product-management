const Account = require('../../models/account.model');
const md5 = require('md5');

const systemConfig = require('../../config/system');

// [GET] admin/auth/login
module.exports.login = (req, res) => {
    res.render('admin/pages/auth/login', {
        pageTitle: "Trang đăng nhập"
    });
};

// [POST] admin/auth/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;

    const user = await Account.findOne(
        {
            email: email,
            deleted: false
        }
    );

    let passwordCheck;

    if (user) {
        passwordCheck = md5(req.body.password) == user.password;
    }
    
    if (!user && !passwordCheck) {
        req.flash('error', 'Sai email hoặc sai mật khẩu');
        res.redirect(req.get('Referer') || '/');
        return;
    }

    if (user.status === 'inactive') {
        req.flash('error', 'Tài khoản đã bị khóa');
        res.redirect(req.get('Referer') || '/');
        return;
    }

    res.cookie('token', user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);

};