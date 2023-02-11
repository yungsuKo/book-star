const express = require('express');
const router = express.Router();
const controller = require('./book.controller');

router.get('/search', controller.getBookSearchList);
router.get('/', controller.getBookList);

module.exports = router;