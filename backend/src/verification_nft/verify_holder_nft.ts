import {PublicKey} from "@solana/web3.js";
import {Metadata} from "@metaplex-foundation/mpl-token-metadata";

const web3 = require('@solana/web3.js');

const url = 'https://api.mainnet-beta.solana.com';
const connection = new web3.Connection(url, 'confirmed');
const programId = new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const walletTokenArray = [];



export async function getTransactionsByWallet(walletPublicKey) {
    return await connection.getConfirmedSignaturesForAddress2(walletPublicKey);
}



// Retourne un tableau contenant toutes les NFTs et tokens d'un wallet
export async function getAllNFTsForWallet(walletPublicKey) {
    try {
        // On définit le wallet à vérifier
        const walletAddress = new web3.PublicKey(walletPublicKey);
        // On récupère tous les comptes de tokens appartenant au portefeuille (walletAddress) et qui sont gérés par le programme (programId)
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {programId})
            // On retourne tous les tokens
            .then((accounts) => accounts)
            .catch((error) => console.error(error));

        // On parcourt tous les tokens et on récupère les métadonnées de chaque NFT
        for (const {account} of tokenAccounts.value) {
            walletTokenArray.push(account.data.parsed.info);
        }
        return walletTokenArray;
    }

    catch (e) {
        return e.message;
    }
}

// Return la metadata d'un NFT (nom, description, image, etc...), mais pas la collection, pour récupérer le nom de la collection il faut utiliser la fonction fetchOtherMetadataNft
export async function getNftMetadata(addressMintNft) {
    try {
        const mintPubkey = new PublicKey(addressMintNft);
        const tokenmetaPubkey = await Metadata.getPDA(mintPubkey);
        return await fetchOtherMetadataNft(tokenmetaPubkey);
    } catch (error) {
        return error.message;
    }
}

// Retourne la metadata d'un nft (nom, description, image, etc...) avec en plus le nom de la collection et d'autres informations
// Le fetch se fait grâce à l'uri récupéré dans la fonction getNftMetadata
async function fetchOtherMetadataNft(tokenmetaPubkey) {
    const metadata = await Metadata.load(connection, tokenmetaPubkey);
    const metadataNft = await fetch(metadata.data.data.uri);
    return await metadataNft.json();
}


// Retourne un tableau contenant les nfts d'une collection (par exemple, tous les nfts de la collection "CryptoPunks") si le wallet en possèdent
export async function verifyIfWalletHasNftOfCollection(walletAdress, collectionName) {
    const nftsOfCollection = [];
    try {
        await getAllNFTsForWallet(walletAdress);
        for (const nft of walletTokenArray) {
            const nftMetadata = await getNftMetadata(nft.mint);
            if (nftMetadata.collection !== undefined && nftMetadata.collection !== null) {
                if (nftMetadata.collection.name === collectionName) nftsOfCollection.push(nftMetadata.name);
            }
        }
        return nftsOfCollection;
    }
    catch (e) {
        return e.message;
    }
}








// Retourne true si le wallet possède le NFT en particulier (pas une collection), false sinon
// export async function checkIfWalletHoldAnNft(walletPublicKey, ntfAddress) {
//     // On définit l'adresse du programme qui gère les tokens
//     // On définit l'adresse du wallet
//     const walletAddress = new web3.PublicKey(walletPublicKey);
//
//     // On récupère tous les comptes de tokens appartenant au portefeuille (walletAddress) et qui sont gérés par le programme (programId)
//     const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {programId})
//         .then((accounts) => accounts)
//         .catch((error) => {
//             console.error(error)
//         });
//
//     // On parcourt tous les tokens et on vérifie si l'un d'eux correspond à l'adresse du NFT
//     for (const {account} of tokenAccounts.value) {
//         const {mint} = account.data.parsed.info;
//         // Si l'adresse du NFT correspond à l'adresse du token, on retourne true (le wallet possède le NFT)
//         if (mint === ntfAddress) {
//             return true;
//         }
//     }
//
//     return false;
// }


// Return les métadonnées d'une NFT
// const Moralis = require("moralis").default;
// export async function getNftMetadata(address) {
//     try {
//         // On se connecte à notre serveur Moralis
//         await Moralis.start({
//             apiKey: process.env.MORALIS_API_KEY,
//         });
//
//
//         // On définit l'adresse du NFT à récupérer, puis on retourne les métadonnées du NFT
//         return Moralis.SolApi.nft.getNFTMetadata({
//             "address": address
//         })
//
//
//     } catch (e) {
//         console.error(e.message);
//     }
//
// }

