const express = require('express');
const route = require('./routes/client/index.route');
const adminRoute = require('./routes/admin/index.route');
const database = require('./config/database');
const methodOverride = require('method-override');

const systemConfig = require('./config/system');

require("dotenv").config();

const app = express();
const port = process.env.PORT;

database.connect();

app.use(methodOverride('_method'));

app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'pug');

route(app);
adminRoute(app);

app.locals.prefixAdmin = systemConfig.prefixAdmin;
// Biến prefixAdmin bây giờ sẽ có thể được gọi ở bất cứ file pug nào

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});