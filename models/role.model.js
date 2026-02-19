const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        permissions: {
            type: Array,
            default: []
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {timestamp: true}
);

const Role = new mongoose.model('Role', roleSchema, 'roles');