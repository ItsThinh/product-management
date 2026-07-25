const User = require('../../models/user.model');


// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {

    const userId = res.locals.user.id;

    const users = await User.find({
        _id: { $ne: userId },
        status: 'active',
        deleted: false
    }).select('id avatar fullName');

    res.render('client/pages/users/not-friend', {
        users: users
    });
};

module.exports.friends = (req, res) => {
    res.render('client/pages/users/friends');
};

module.exports.request = (req, res) => {
    res.render('client/pages/users/requests');
};

module.exports.accept = (req, res) => {
    res.render('client/pages/users/accept-requests');
};