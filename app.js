const path = require('path')
const express = require('express');
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static('public'));
app.use('/api', require('./routes/api'))
app.use('/', require('./routes/controller/home.controller'));

app.listen(3000, ()=>{
    console.log("server is running");
})