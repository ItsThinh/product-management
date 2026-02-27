module.exports.createPost = (req, res, next) => {
    if (!req.body.fullName || req.body.fullName.trim() == '') {
        req.flash('error',' Vui lòng nhập họ tên!');
        res.redirect(req.get('Referrer') || '/');
        return;
    }

    // if (!req.body.password || req.body.password.trim() == '') {
    //     req.flash('error',' Vui lòng nhập mật khẩu!');
    //     res.redirect(req.get('Referrer') || '/');
    //     return;
    // }

    if (!req.body.phone || req.body.phone.trim() == '') {
        req.flash('error',' Vui lòng nhập số điện thoại!');
        res.redirect(req.get('Referrer') || '/');
        return;
    }

    next();
}