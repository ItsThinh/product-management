module.exports.createPost = (req, res, next) => {
    if (!req.body.title || req.body.title.trim() == '') {
        req.flash('error',' Vui lòng nhập tiêu đề!');
        res.redirect(req.get('Referrer') || '/');
        return;
    }

    next();
}