const web3 = require('@solana/web3.js');
const url = 'https://api.mainnet-beta.solana.com';

const connection = new web3.Connection(url, 'confirmed');
const publicKey = new web3.PublicKey('FrSdXZdV9H9vDjTgXzHujxC93HnPUmpDfVYsRVc5fyp4');

export async function getTransactionsByWallet() {
    return await connection.getConfirmedSignaturesForAddress2(publicKey);
}


export async function getAllNFTsForWallet(walletPublicKey) {

    const programId = new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    const walletAddress = new web3.PublicKey(walletPublicKey);
    const nftInfos = [];

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {programId})
        .then((accounts) => accounts)
        .catch((error) => console.error(error));
    for (const {account} of tokenAccounts.value) {
        const mintAddress = account.data.parsed.info.mint;

        const parsedTokenAccount = await connection.getParsedAccountInfo(programId)


        const { value: { data: { parsed } } } = parsedTokenAccount;
        if (parsed?.type === 'spl-token-account2') {
            if (parsed.info.isNative) {
                console.log('token is native')

                // ignore native token account
                continue;
            }

            console.log('token is not native')


            const tokenAddress = new web3.PublicKey(parsed.info.mint);
            const tokenAmount = new web3.u64(parsed.info.tokenAmount.amount);
            const tokenInfo = await connection.getParsedAccountInfo(tokenAddress)


            if (tokenInfo?.value?.owner?.equals(programId)) {
                console.log('token is an NFT')// token is an NFT
                const nftInfo = {
                    tokenAddress: tokenAddress.toString(),
                    mintAddress: mintAddress,
                    name: tokenInfo.value.data.parsed.info.name,
                    symbol: tokenInfo.value.data.parsed.info.symbol,
                    amount: tokenAmount.toString(),
                };
                nftInfos.push(nftInfo);
            }
        }
    }

    return nftInfos;
}