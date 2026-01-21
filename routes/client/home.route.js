const express = require('express');
const router = express.Router();
// router chứa Router Object

const controller = require("../../controllers/client/home.controller");

router.get('/', controller.index);
// Gọi hàm index trong controller cho yêu cầu đến trang chủ

module.exports = router;