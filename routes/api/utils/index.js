const router = require('express').Router();
const controller = require('./util.controller');

router.post('/profile_image_uploader', controller.profileImageUploader);

module.exports = router;