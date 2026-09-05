const User = require('../../models/user.model');

const userSocket = require('../../sockets/client/user.socket');


// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {

    // Socket
    userSocket(res);
    // End Socket

    // res.locals.user đã được gán sẵn document của User hiện tại từ auth.middleware/user.middleware
    const myUser = res.locals.user;

    // Lấy danh sách ID lời mời kết bạn đã gửi (thêm || [] để phòng trường hợp undefined tránh gây sập app)
    const requestFriend = myUser.requestFriend || [];

    const acceptFriend = myUser.acceptFriend || [];

    const friendList = (myUser.friendList || []).map(item => item.user_id);

    const users = await User.find({
        // Toán tử ... đưa các phần tử trong mảng ra ngoài
        _id: { $nin: [myUser.id, ...requestFriend, ...acceptFriend, ...friendList] },
        status: 'active',
        deleted: false
    }).select('id avatar fullName');

    res.render('client/pages/users/not-friend', {
        users: users,
        pageTitle: 'Danh sách người dùng'
    });
};

module.exports.friends = (req, res) => {
    res.render('client/pages/users/friends', {
        pageTitle: 'Danh sách bạn bè'
    });
};

module.exports.request = async (req, res) => {

    userSocket(res);

    const localUser = res.locals.user;
    const requestList = localUser.requestFriend || [];

    const requestedUser = await User.find({
        _id: { $in: requestList },
        status: 'active',
        deleted: false
    }).select('id avatar fullName');

    res.render('client/pages/users/requests', {
        users: requestedUser,
        pageTitle: 'Lời mời đã gửi'
    });
};

module.exports.accept = async (req, res) => {

    userSocket(res);

    const localUser = res.locals.user;
    const acceptList = localUser.acceptFriend || [];

    const acceptFriend = await User.find({
        _id: { $in: acceptList },
        status: 'active',
        deleted: false
    }).select('id avatar fullName');

    res.render('client/pages/users/accept-requests', {
        users: acceptFriend,
        pageTitle: 'Lời mời kết bạn'
    });
};