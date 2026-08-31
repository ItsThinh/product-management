const User = require('../../models/user.model');

module.exports = (res) => {
    _io.once('connection', (socket) => {
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

        });

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
        })
    });
}