const express = require('express');
const router = express.Router();
const multer = require('multer');
// const storageMulter = require('../../helpers/storageMulter')(multer);
const upload = multer();

const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

const controller = require('../../controllers/admin/product.controller');
const validate = require('../../validates/admin/product.validate');

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);
// :status và :id là route params, Express sẽ map vào req.params trong controller

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteItem);

router.get('/create', controller.create);

router.post(
    '/create',
    // Multer middleware: chỉ nhận 1 file từ form có name="thumbnail"
    // File đó sẽ được gắn vào req.file
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
    );

router.get('/detail/:id', controller.detail);

module.exports = router;