// Cloudinary
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
// End Cloudinary

let streamUpLoad = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
        });
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

module.exports = async (buffer) => {
    let result = await streamUpLoad(buffer);
    // Lấy tên field của file (vd: "thumbnail")
    // rồi gán link Cloudinary vào đúng key đó trong req.body
    // => để controller có thể lưu URL ảnh vào database
    return result.secure_url;
}