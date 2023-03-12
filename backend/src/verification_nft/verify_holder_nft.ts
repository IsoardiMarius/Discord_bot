const Moralis = require("moralis").default;
const web3 = require('@solana/web3.js');

const url = 'https://api.mainnet-beta.solana.com';
const connection = new web3.Connection(url, 'confirmed');
const publicKey = new web3.PublicKey('FrSdXZdV9H9vDjTgXzHujxC93HnPUmpDfVYsRVc5fyp4');
const programId = new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');


export async function getTransactionsByWallet() {
    return await connection.getConfirmedSignaturesForAddress2(publicKey);
}


export async function checkIfWalletHoldNft(walletPublicKey, ntfAddress) {
    // On définit l'adresse du programme qui gère les tokens
    // On définit l'adresse du wallet
    const walletAddress = new web3.PublicKey(walletPublicKey);

    // On récupère tous les comptes de tokens appartenant au portefeuille (walletAddress) et qui sont gérés par le programme (programId)
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {programId})
        .then((accounts) => accounts)
        .catch((error) => {
            console.error(error)
        });

    // On parcourt tous les tokens et on vérifie si l'un d'eux correspond à l'adresse du NFT
    for (const {account} of tokenAccounts.value) {
        const {mint} = account.data.parsed.info;
        // Si l'adresse du NFT correspond à l'adresse du token, on retourne true (le wallet possède le NFT)
        if (mint === ntfAddress) {
            return true;
        }
    }

    return false;
}

export async function getNftMetadata(address) {
    try {
        // On se connecte a notre serveur Moralis
        await Moralis.start({
            apiKey: "V1qMRYEZAhiylWf6KFL9SuJh3Et1XImsuVZYjPwIX80J5zi4nph9uvMYLQOTaT3P"
        });

        // On définit l'adresse du NFT à récupérer, puis on retourne les métadonnées du NFT
        return Moralis.SolApi.nft.getNFTMetadata({
            "address": address
        });

    } catch (e) {
        console.error(e);
    }

}


export async function getAllNFTsForWallet(walletPublicKey) {
    // On définit le wallet à vérifier
    const walletAddress = new web3.PublicKey(walletPublicKey);
    const nftArray = [];

    // On récupère tous les comptes de tokens appartenant au portefeuille (walletAddress) et qui sont gérés par le programme (programId)
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {programId})
        // On retourne tous les tokens
        .then((accounts) => accounts)
        .catch((error) => console.error(error));

    // On parcourt tous les tokens et on récupère les métadonnées de chaque NFT
    for(const {account} of tokenAccounts.value) {
        nftArray.push(account.data.parsed.info);
    }

    return nftArray;
}

