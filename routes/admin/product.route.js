const express = require('express');
const router = express.Router();
const multer = require('multer');
const storageMulter = require('../../helpers/storageMulter')(multer);
const upload = multer({ storage: storageMulter })

const controller = require('../../controllers/admin/product.controller');

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);
// :status và :id là route params, Express sẽ map vào req.params trong controller

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteItem);

router.get('/create', controller.create);

router.post('/create', upload.single('thumbnail'), controller.createPost);

module.exports = router;