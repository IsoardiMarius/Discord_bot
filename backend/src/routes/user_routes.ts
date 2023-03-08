const express = require('express');
const router = express.Router();
const UserCtrl = require('../controllers/user_controllers');

router.get('/users', UserCtrl.get_users);

module.exports = router;