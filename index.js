require("dotenv").config();
const express = require('express');
const route = require('./routes/client/index.route');
const adminRoute = require('./routes/admin/index.route');
const database = require('./config/database');
const dns = require('node:dns/promises');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

const systemConfig = require('./config/system');

const app = express();
const port = process.env.PORT;

dns.setServers(['1.1.1.1', '8.8.8.8']);
database.connect();

app.use(methodOverride('_method'));

// Tiny MCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// End Tiny MCE

// Flash
app.use(cookieParser('keyboard cat'));  // Lưu vào cookie
app.use(session({ cookie: { maxAge: 60000 } })); // Thời gian tồn tại 60s
app.use(flash());
// End Flash

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(`${__dirname}/public`));

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

// Route
route(app);
adminRoute(app);

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
// Biến prefixAdmin bây giờ sẽ có thể được gọi ở bất cứ file pug nào

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});