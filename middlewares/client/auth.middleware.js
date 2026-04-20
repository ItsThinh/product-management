const User = require('../../models/user.model');

module.exports.requireAuth = async (req, res, next) => {

    if (!req.cookies.tokenUser) {
        return res.redirect(`/user/login`);
    } else {
        const user = await User
            .findOne({
                token: req.cookies.tokenUser,
                deleted: false
            })
            .select('-password');

        if (!user) {
            console.log('user not found');
            res.redirect(`/user/login`);
            return;
        }

        res.locals.user = user;
        
        next();
    }
    
}