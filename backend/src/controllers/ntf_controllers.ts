import NftService from "../services/nft_service";

exports.verify_wallet_nft = (req, res) => {
    const wallet_adress = req.params.wallet_address;
    const creator_adress = req.params.creator_address;

    new NftService().verifyWalletNftAuthor(wallet_adress, creator_adress)
        .then((arrayNftLength) => {
            res.json(arrayNftLength);
        })
        .catch((err) => {
            res.json(err.message);
        });
}