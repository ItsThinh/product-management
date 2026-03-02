const Account = require('../../models/account.model');

const systemConfig = require('../../config/system');

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
        const user = await Account.find({
            token: req.cookies.token,
            deleted: false
        });
        if (!user) {
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
            return;
        }
        next();
    }
    
}