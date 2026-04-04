const User = require('../../models/user.model');
const ForgotPassword = require('../../models/forgot-password.model');

const md5 = require('md5');
const generateHelper = require('../../helpers/generate');
const sendMailHelper = require('../../helpers/sendMail');

// [GET] user/register
module.exports.register = async (req, res) => {
    res.render('client/pages/user/register.pug', {
        pageTitle: 'Đăng ký tài khoản'
    });
};

// [GET] user/register
module.exports.registerPost = async (req, res) => {

    const emailExist = await User.findOne( { email: req.body.email });

    if (emailExist) {
        req.flash('error', 'Email đã được đăng ký');
        return res.redirect(req.get('Referer') || '/user/register');
    }

    const newUser = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        password: md5(req.body.password)
    });

    await newUser.save();

    res.cookie('tokenUser', newUser.token);

    req.flash('success', 'Đăng ký thành công');
    res.redirect('/');
};

// [GET] /user/login
module.exports.login = (req, res) => {
    res.render('client/pages/user/login');
};

// [GET] /user/login
module.exports.loginPost = async (req, res) => {
    const user = await User.findOne({ email: req.body.email, password: md5(req.body.password) });
    if (!user) {
        req.flash('error', 'Email không tồn tại hoặc mật khẩu không khớp');
        return res.redirect(req.get('Referer') || '/user/login');
    }

    if (user.status == 'inactive') {
        req.flash('error', 'Tài khoản đã bị khóa');
        return res.redirect(req.get('Referer') || '/user/login');
    }

    res.cookie('tokenUser', user.token);

    res.redirect('/');
}

// [GET] /user/logout
module.exports.logout = (req, res) => {
    res.clearCookie('tokenUser');
    res.redirect('/');
}

// [GET] /user/password/forgot
module.exports.forgotPassword = (req, res) => {
    res.render('client/pages/user/forgot-password', {
        pageTitle: 'Lấy lại mật khẩu'
    });
};

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({ email: email, deleted: false });
    if (!user) {
        req.flash('error', 'Email không tồn tại');
        return res.redirect(req.get('Referer') || '/user/password/forgot');
    }

    // OTP Existed
    const otpExist = await ForgotPassword.findOne({ email: email }).lean();
    if (otpExist) {
        console.log(otpExist);
        req.flash('error', 'Mã OTP đã được gửi, vui lòng kiểm tra trong email');
        return res.redirect(`/user/password/otp?email=${email}`);
    }
    // End OTP Existed
    
    const otp = generateHelper.generateRandomNumber(6);

    const objectForgotPassword = {
        email: email,
        otp: otp
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    const subject = 'Mã OTP lấy lại mật khẩu';
    const html = `
        Mã OTP lấy lại mật khẩu là <b>${otp}</b>.
        <br>
        Hạn dùng: 3 phút.
        <br>
    `;
    
    sendMailHelper.sendMail(email, subject, html);

    req.flash('success', 'Mã OTP đã được gửi, vui lòng kiểm tra email');
    res.redirect(`/user/password/otp?email=${user.email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = (req, res) => {
    const email = req.query.email;
    res.render('client/pages/user/otp-password', {
        pageTitle: 'Lấy lại mật khẩu',
        email: email
    });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = parseInt(req.body.otp);

    const otpExisted = await ForgotPassword.findOne({ email: email, otp: otp });

    if (!otpExisted) {
        req.flash('error', 'Mã OTP không chính xác');
        return res.redirect(req.get('Referer') || `/user/password/otp?email=${email}`);
    }

    const user = await User.findOne({ email: email });

    if (user) {
        res.cookie('tokenUser', user.token);
    }

    res.redirect('/user/password/reset');
};

// [GET] /user/password/reset
module.exports.resetPassword = (req, res) => {
    res.render('client/pages/user/reset-password', {
        pageTitle: 'Nhập mật khẩu mới'
    });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const token = req.cookies.tokenUser;

    await User.updateOne(
        { token: token },
        { $set: { password: md5(password) } }
    );

    req.flash('success', 'Đổi mật khẩu thành công');
    res.redirect('/');
};

// [GET] /user/info
module.exports.info = async (req, res) => {

    const user = await User.findOne({ token: req.cookies.tokenUser }).select('-password');

    res.render('client/pages/user/info', {
        pageTitle: 'Thông tin cá nhân',
        userInfo: user
    });
};