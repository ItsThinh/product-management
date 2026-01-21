const express = require('express');
const route = require('./routes/client/index.route');
const adminRoute = require('./routes/admin/index.route');
const database = require('./config/database');

require("dotenv").config();

const app = express();
const port = process.env.PORT;

database.connect();

app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'pug');

route(app);
adminRoute(app);

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});