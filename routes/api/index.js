const express = require('express');
const router = express();
const book = require('./book');
const user = require('./user');
const utils = require('./utils');

router.use("/book", book);
router.use("/user", user);
router.use("/utils", utils);

module.exports = router;