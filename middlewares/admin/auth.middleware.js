const Account = require('../../models/account.model');
const Role = require('../../models/role.model');

const systemConfig = require('../../config/system');

module.exports.requireAuth = async (req, res, next) => {

    if (!req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
        // console.log(req.cookies.token);
        const user = await Account
            .findOne({
                token: req.cookies.token,
                deleted: false
            })
            .select('-password -token');

        if (!user) {
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
            return;
        }

        res.locals.user = user;
        res.locals.role = await Role
            .findOne({
                _id: user.role_id
            })
            .select('title permissions');
        
        next();
    }
    
}