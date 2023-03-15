const express = require('express');
const router = express.Router();
const NftCtrl = require('../controllers/ntf_controllers');


router.get('/nft_verification/:wallet_address/:creator_address', NftCtrl.verify_wallet_nft);

module.exports = router;


