const express = require('express');
// nạp module express từ express_modules

const route = require('./routes/client/index.route');
// nạp module route tự viết để app đăng ký router

const database = require('./config/database');
// nạp module cấu hình database

require("dotenv").config();
// load biến môi trường từ file .env vào process.env
// process đại diện cho tiến trình Node đang chạy

const app = express();
// Gọi express() tạo 1 Express application object
// app sẽ làm đại diện cho toàn bộ server được dùng xuyên suốt vòng đời (middleware, route, config)

const port = process.env.PORT;
// Lấy PORT từ biến trong file .env

database.connect();
// Gọi hàm connect() trong database.js được load ở hàm database

app.use(express.static('public'));
// Đăng ký middleware phục vụ file tĩnh (CSS, JS, Image) từ thư mục public

app.set('views', './views');
// Cấu hình thư mục gốc chứa các template view.
// Giá trị này chỉ được Express sử dụng khi gọi res.render().
// Khi render, Express sẽ lấy đường dẫn từ 'views',
// ghép với tên view và đuôi của view engine (vd: .pug)
// để xác định chính xác file template cần render.

app.set('view engine', 'pug');
//Cấu hình template engine là Pug

route(app);

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
// Khởi động HTTP server và bắt đầu lắng nghe request