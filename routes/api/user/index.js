const express = require('express');
const router = express();
const controller = require('./user.controller');

router.post('/signup', controller.signup);

module.exports = router;