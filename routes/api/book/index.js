const express = require('express');
const router = express.Router();
const controller = require('./book.controller');

router.get('/:id', controller.getBookDetail);
router.get('/search', controller.getBookSearchList);
router.get('/', controller.getBookList);

module.exports = router;