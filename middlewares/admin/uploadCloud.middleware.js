const uploadToCloudinary = require('../../helpers/uploadToCloudinary');

module.exports.upload = async (req, res, next) => {
    // Không có file thì bỏ việc thực thi upload ảnh lên Cloudinary và nhảy sang middleware tiếp theo
    if (req.file) {
        const link = await uploadToCloudinary(req.file.buffer);
        req.body[req.file.fieldname] = link;
    }
    next();
}