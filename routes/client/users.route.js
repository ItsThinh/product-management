// Router này dùng để xử lý các yêu cầu liên quan đến kết bạn
const express = require('express');
const router = express.Router();

const controller = require('../../controllers/client/users.controller');

router.get('/not-friend', controller.notFriend);
router.get('/friends', controller.friends);
router.get('/request', controller.request);
router.get('/accept', controller.accept);

module.exports = router;