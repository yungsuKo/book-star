const express = require('express');
const router = express();
const controller = require('./user.controller');

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.get('/auth/kakao/signin', controller.signInKakao)
router.post('/logout', controller.logout);
router.get('/mybooks/:id', controller.mybooksDetail);
router.post('/mybooks/:id', controller.mybooksUpdate);
router.get('/mybooks', controller.mybooks);

module.exports = router;