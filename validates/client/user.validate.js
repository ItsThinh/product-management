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