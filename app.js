const path = require('path')
const express = require('express');
const authMiddleware = require('./middlewares/jwt');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const app = express();
const db = require('./db');
const port = process.env.PORT || 3000;
require('dotenv').config();

db();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(cookieParser());
app.use(authMiddleware);
app.use(express.json());
app.use(express.static('public'));

app.use('/api', require('./routes/api'));
app.use('/', require('./routes/controller/home.controller'));
app.use('/book', require('./routes/controller/book.controller'));
app.use('/user', require('./routes/controller/user.controller'));

app.listen(port, ()=>{
    console.log("server is running");
})