const express = require('express');
const router = express();
const controller = require('./user.controller');

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/logout', controller.logout);

module.exports = router;