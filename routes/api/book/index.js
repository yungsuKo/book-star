const express = require('express');
const router = express();
const controller = require('./book.controller');

router.get('/search', controller.getBookSearchList);
router.post('/save/:id', controller.postBookSave);
router.post('/unsave/:id', controller.postBookUnsave);
router.get('/:id', controller.getBookDetail);
router.get('/', controller.getBookList);

module.exports = router;