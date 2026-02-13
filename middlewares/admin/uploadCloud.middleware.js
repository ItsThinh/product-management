// Cloudinary
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
// End Cloudinary

module.exports.upload = async (req, res, next) => {
    try {

        // Không có file thì bỏ việc thực thi upload ảnh lên Cloudinary và nhảy sang middleware tiếp theo
        if (!req.file) {
            return next();
        }
        
        let streamUpLoad = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        let result = await streamUpLoad(req);
        // Lấy tên field của file (vd: "thumbnail")
        // rồi gán link Cloudinary vào đúng key đó trong req.body
        // => để controller có thể lưu URL ảnh vào database
        req.body[req.file.fieldname] = result.url;

        next();
    } catch (error) {
        next(error);
    }
}