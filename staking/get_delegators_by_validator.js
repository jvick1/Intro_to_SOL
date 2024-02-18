const { Connection, clusterApiUrl, LAMPORTS_PER_SOL, Keypair, Authorized, Lockup, sendAndConfirmTransaction, StakeProgram, PublicKey } = require("@solana/web3.js");

const main = async() => {
    const connection = new Connection(clusterApiUrl('devnet'), 'processed');
    const STATE_PROGRAM_ID = new PublicKey("Stake11111111111111111111111111111111111111");
    const VOTE_PUB_KEY = "vgcDar2pryHvMgPkKaZfh8pQy4BJxv7SpwUG7zinWjG"
    const accounts = await connection.getParsedProgramAccounts(STATE_PROGRAM_ID, {
        filters: [
            {dataSize: 200},
            {
                memcmp: {
                    offset: 124,
                    bytes: VOTE_PUB_KEY,
                },
            },
        ],
    });

    console.log(`Total number of delegators found for ${VOTE_PUB_KEY} is: ${accounts.length}`);
    if (accounts.length) {
        console.log(`Sample delegator: ${JSON.stringify(accounts[0])}`);
    }
};

const runMain = async() => {
    try {
        await main();
    } catch(error){
        console.error(error);
    }
};

runMain();
