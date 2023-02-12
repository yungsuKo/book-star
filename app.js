const path = require('path')
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const db = require('./db');
require('dotenv').config();

db();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.static('public'));

app.use('/api', require('./routes/api'));
app.use('/', require('./routes/controller/home.controller'));
app.use('/book', require('./routes/controller/book.controller'));
app.use('/user', require('./routes/controller/user.controller'));

app.listen(3000, ()=>{
    console.log("server is running");
})