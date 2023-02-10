const express = require('express');
const router = express.Router();
const controller = require('./book.controller');

router.get('/', controller.getBookSearchList);

module.exports = router;