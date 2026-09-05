const mongoose = require('mongoose');
const generate = require('../helpers/generate');

const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        phone: String,
        token: {
            type: String,
            default: generate.generateRandomString(30)
        },
        avatar: String,
        status: {
            type: String,
            default: 'active'
        },
        requestFriend: Array, // Lời mời đã gửi cho người khác
        acceptFriend: Array, // Lời mời đã nhận từ người khác
        friendList: [         // Danh sách bạn bè và phòng chat
            {
                user_id: String, // ID của người bạn
                room_chat_id: String // ID của phòng chat
            }
        ],
        statusOnline: {
            type: String,
            default: 'offline'
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
);

const User = new mongoose.model('user', userSchema, 'users');

module.exports = User;