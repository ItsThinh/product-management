const User = require('../../models/user.model');
const md5 = require('md5');

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
