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

    const users = await User.find({
        // Toán tử ... đưa các phần tử trong mảng ra ngoài
        _id: { $nin: [myUser.id, ...requestFriend, ...acceptFriend] },
        status: 'active',
        deleted: false
    }).select('id avatar fullName');

    res.render('client/pages/users/not-friend', {
        users: users,
        pageTitle: 'Danh sách người dùng'
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