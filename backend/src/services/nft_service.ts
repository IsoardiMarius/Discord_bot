import {PublicKey} from "@solana/web3.js";
import {Metadata} from "@metaplex-foundation/mpl-token-metadata";

const web3 = require('@solana/web3.js');




export default class NftService {
    protected url: string = 'https://api.mainnet-beta.solana.com';
    protected connection = new web3.Connection(this.url, 'confirmed');
    programId = new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    protected walletTokenArray = [];


     async getTransactionsByWallet(_walletPublicKey: string) {
         const walletPublicKey = new web3.PublicKey(_walletPublicKey);
         return await this.connection.getConfirmedSignaturesForAddress2(walletPublicKey);
    }

    // Retourne un tableau contenant toutes les NFTs et tokens d'un wallet
     async getAllNFTsForWallet(_walletAddress: string): Promise< any[] > {
        try {
            // On définit le wallet à vérifier
            const walletPublicKey = new web3.PublicKey(_walletAddress);
            // On récupère tous les comptes de tokens appartenant au portefeuille (_walletAddress) et qui sont gérés par le programme (programId)
            const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(walletPublicKey, {programId: this.programId})
                .then((accounts) => accounts)
                .catch((error) => console.error(error));

            // On parcourt tous les tokens et on les ajoute au tableau
            for (const {account} of tokenAccounts.value) {
                this.walletTokenArray.push(account.data.parsed.info);
            }
            // On retourne le tableau
            return this.walletTokenArray;
        }

        catch (e) {
            return e.message;
        }
    }

    // Return la metadata d'un NFT (nom, description, image, etc...), mais pas la collection, pour récupérer le nom de la collection il faut utiliser la fonction fetchOtherMetadataNft
     async  getNftMetadata(addressMintNft: string): Promise< string | null > {
        try {
            // On définit la clé publique du NFT à vérifier
            const nftPubKey = new PublicKey(addressMintNft);
            // On récupère la clé publique de la metadata du NFT à vérifier
            const tokenmetaPubkey = await Metadata.getPDA(nftPubKey);
            // On récupère la metadata du NFT à vérifier
            const nftMetadata =  await Metadata.load(this.connection, tokenmetaPubkey);
            // Si la nft possède bien un créateur, on retourne son adresse, sinon on retourne null
            if(nftMetadata.data != null && nftMetadata.data.data.creators !== undefined) {
                return nftMetadata.data.data.creators[0].address;
            }
            else {
                return null;
            }

        } catch (error) {
            return error.message;
        }
    }


// Retourne une valeur qui sera égale au nombre de NFTs d'une collection que possède le wallet
// (0 si le wallet ne possède pas de NFTs de cette collection)
     async  verifyWalletNftAuthor(_walletAdress: string, _creatorAddress: string): Promise< number > {
        // On initialise un tableau qui contiendra tous les NFTs d'un créateur (si le wallet en possède)
        const nftsOfCollection = [];
        try {
            // On récupère tous les NFTs du wallet
            await this.getAllNFTsForWallet(_walletAdress);

            // On vérifie si le wallet possède des NFTs
            if(this.walletTokenArray.length === 0) { return 0 }

            // On parcourt tous les NFTs du wallet
            for (const nft of this.walletTokenArray) {
                // On récupère l'adresse du créateur du NFT
                const nftCreatorAdress = await this.getNftMetadata(nft.mint);
                // On ajoute le NFT au tableau si l'adresse du créateur correspond à l'adresse du créateur de la collection passée en paramètre
                if(nftCreatorAdress === _creatorAddress) {
                    nftsOfCollection.push(nftCreatorAdress);
                }
            }
            // On retourne le nombre de NFTs de la collection que possède le wallet
            return nftsOfCollection.length;
        }
        catch (e) {
            return e.message;
        }
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
// export async function getNftMetadatas(address) {
//
//
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

