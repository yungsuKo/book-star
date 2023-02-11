const path = require('path')
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const db = require('./db');
require('dotenv').config();

db();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// app.use(express.json());
app.use(express.static('public'));
app.use('/api', require('./routes/api'))
app.use('/', require('./routes/controller/home.controller'));
app.use('/books', require('./routes/controller/book.controller'));

app.listen(3000, ()=>{
    console.log("server is running");
})