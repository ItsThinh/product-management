module.exports.registerPost = (req, res, next) => {

    if (!req.body.fullName || !req.body.fullName.trim()) {
        console.log('ho ten rong');
        req.flash('error', 'Vui lòng nhập họ tên');
        return res.redirect(req.get('Referer') || '/user/register');
    }
    
    if (!req.body.password || !req.body.password.trim()) {
        req.flash('error', 'Vui lòng nhập mật khẩu');
        return res.redirect(req.get('Referer') || '/user/register');
    }
    
    if (!req.body.email || !req.body.email.trim()) {
        req.flash('error', 'Vui lòng nhập email');
        return res.redirect(req.get('Referer') || '/user/register');
    }

    next();
}

module.exports.loginPost = (req, res, next) => {
    
    if (!req.body.password || !req.body.password.trim()) {
        req.flash('error', 'Vui lòng nhập mật khẩu');
        return res.redirect(req.get('Referer') || '/user/login');
    }
    
    if (!req.body.email || !req.body.email.trim()) {
        req.flash('error', 'Vui lòng nhập email');
        return res.redirect(req.get('Referer') || '/user/login');
    }

    next();
}

module.exports.forgotPasswordPost = (req, res, next) => {

    if (!req.body.email || !req.body.email.trim()) {
        req.flash('error', 'Vui lòng nhập email');
        return res.redirect(req.get('Referer') || '/user/login');
    }

    next();
}

module.exports.resetPasswordPost = (req, res, next) => {
    if (!req.body.password || !req.body.password.trim()) {
        req.flash('error', 'Vui lòng nhập mật khẩu');
        return res.redirect(req.get('Referer') || '/user/password/reset');
    }

    if (!req.body.confirmPassword || !req.body.confirmPassword.trim()) {
        req.flash('error', 'Vui lòng nhập xác nhận mật khẩu');
        return res.redirect(req.get('Referer') || '/user/password/reset');
    }

    if (req.body.confirmPassword != req.body.password) {
        req.flash('error', 'Mật khẩu không khớp');
        return res.redirect(req.get('Referer') || '/user/password/reset');
    }

    next();
    
}