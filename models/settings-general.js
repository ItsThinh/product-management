const mongoose = require('mongoose');

const settingsGeneral = new mongoose.Schema(
    {
        websiteName: String,
        logo: String,
        phone: Number,
        email: String,
        address: String,
        copyright: String
    },
    {
        timestamps: true
    }
);

const SettingsGeneral = new mongoose.model('SettingsGeneral', settingsGeneral, 'settings-general');

module.exports = SettingsGeneral;