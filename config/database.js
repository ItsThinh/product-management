const mongoose = require('mongoose');

module.exports.connect = async () => {
// Viết tắt của:
// module.exports = { connect: async () => { ... } };
// Tức là module này export ra một object có property `connect` là một hàm.
    try {
        console.log('Connecting database...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connect success');
    } catch (error) {
        console.log("Can't connect");
    }
}