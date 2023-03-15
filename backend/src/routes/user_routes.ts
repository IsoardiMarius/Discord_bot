const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/user_controllers');

router.get('/user/', UserCtrl.get_users);

module.exports = router;

export {}
