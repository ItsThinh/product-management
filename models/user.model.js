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