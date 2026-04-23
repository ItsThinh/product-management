const Chat = require('../../models/chat.model');

// [GET] /chat
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    
    // Socket.io
    _io.once('connection', (socket) => {
        socket.on('CLIENT_SEND_MESSAGE', async (content) => {
            // Lưu vào database
            const chat = new Chat({
                user_id: userId,
                content: content
            });
            await chat.save();

            // Trả data về client 
            _io.emit('SERVER_RETURN_MESSAGE', {
                userId: userId,
                fullName: fullName,
                content: content
            });
        });

    });
    // End Socket.io
    

    // Add User Information To Chat
    const chatsWithUserInfo = await Chat.aggregate([
        // Tìm các chat có deleted: false
        {
            $match: { deleted: false }
        },
        // Tạo 1 khóa mới mang giá trị của user_id nhưng có kiểu là ObjectId
        // Mục đích là để lấy nó tham chiếu với _id của các record bên users
        {
            $addFields: { 
                user_id_obj: { $toObjectId: '$user_id' }
            }
        },
        // Lấy thông tin từ users bằng việc tham chiếu giữa user_id_obj của chat và _id của users
        // Kết quả trả về sẽ là một mảng
        {
            $lookup: {
                from: 'users',
                localField: 'user_id_obj',
                foreignField: '_id',
                as: 'user'
            }
        },
        // unwind có tác dụng đưa mảng từ lookup thành kiểu object
        {
            $unwind: '$user'
        },
        // Lựa chọn các dữ liệu sẽ được giữ lại
        {
            $project: {
                user_id: 1,
                room_chat_id: 1,
                content: 1,
                images: 1,
                'user.fullName': 1,
                'user.avatar': 1
            }
        }
    ]);

    // End Add User Information To Chat

    res.render('client/pages/chat/index', {
        pageTitle: 'Chat',
        chats: chatsWithUserInfo
    });
}