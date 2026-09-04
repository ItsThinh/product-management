const User = require('../../models/user.model');

module.exports = (res) => {
    _io.once('connection', (socket) => {
        // Chức năng gửi lời mời kết bạn
        socket.on('CLIENT_ADD_FRIEND', async (userId) => {
            const myUserId = res.locals.user.id;

            // Thêm Id của B vào requestFriend của A (A gửi lời mời cho B)
            const existBinA = await User.findOne({
                _id: myUserId,
                requestFriend: userId
            });

            if (!existBinA) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $push: { requestFriend: userId }
                });
            }

            // Thêm Id của A vào acceptFriend của B (B nhận lời mời từ A)
            const existAinB = await User.findOne({
                _id: userId,
                acceptFriend: myUserId
            });

            if (!existAinB) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $push: { acceptFriend: myUserId }
                });
            }

            // Lấy ra độ dài acceptFriend của B và trả về
            const infoUserB = await User.findOne(
                { _id: userId }
            );

            const lengthAcceptFriends = infoUserB.acceptFriend.length;

            socket.broadcast.emit('SERVER_RETURN_LENGTH_ACCEPT_FRIEND', {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            });

        });

        // Chức năng hủy kết bạn
        socket.on('CLIENT_CANCEL_FRIEND', async (userId) => {
            const myUserId = res.locals.user.id;
            // Xóa id của B trong requestFriend của A
            const existBinA = await User.findOne({
                _id: myUserId,
                requestFriend: userId
            });

            if (existBinA) {
                await User.updateOne(
                    { _id: myUserId },
                    { $pull: { requestFriend: userId } }
                );
            }

            // Xóa id của A trong accept Friend của B
            const existAinB = await User.findOne({
                _id: userId,
                acceptFriend: myUserId
            });

            if (existAinB) {
                await User.updateOne(
                    { _id: userId },
                    { $pull: { acceptFriend: myUserId } }
                )
            }



        });

        // Chức năng từ chối kết bạn
        socket.on('CLIENT_REFUSE_FRIEND', async (userId) => {
            const myUserId = res.locals.user.id;
            // myUserId: A
            // userId: B
            // Xóa id của A trong requestFriend của B
            const existAinB = await User.findOne({
                _id: userId,
                requestFriend: myUserId
            });

            if (existAinB) {
                await User.updateOne(
                    { _id: userId },
                    { $pull: { requestFriend: myUserId } }
                );
            }

            // Xóa id của B trong accept Friend của A
            const existBinA = await User.findOne({
                _id: myUserId,
                acceptFriend: userId
            });

            if (existBinA) {
                await User.updateOne(
                    { _id: myUserId },
                    { $pull: { acceptFriend: userId } }
                )
            }
        });

        // Chức năng chấp nhận kết bạn
        socket.on('CLIENT_ACCEPT_FRIEND', async (userId) => {
            const myUserId = res.locals.user.id;
            // myUserId: A
            // userId: B

            // Xóa id của A trong requestFriend của B và đưa id của A vào friendList của B
            const existAinB = await User.findOne({
                _id: userId,
                requestFriend: myUserId
            });

            if (existAinB) {
                await User.updateOne(
                    { _id: userId },
                    {
                        $pull: { requestFriend: myUserId },
                        $push: {
                            friendList: {
                                user_id: myUserId,
                                room_chat_id: ""
                            }
                        }
                    }
                );
            }

            // Xóa id của B trong accept Friend của A và đưa id của B vào friendList của A
            const existBinA = await User.findOne({
                _id: myUserId,
                acceptFriend: userId
            });

            if (existBinA) {
                await User.updateOne(
                    { _id: myUserId },
                    {
                        $pull: { acceptFriend: userId },
                        $push: {
                            friendList: {
                                user_id: userId,
                                room_chat_id: ""
                            }
                        }
                    }
                );
            }
        });
    });
}