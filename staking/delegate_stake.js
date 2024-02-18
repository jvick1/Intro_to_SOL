const { Connection, clusterApiUrl, LAMPORTS_PER_SOL, Keypair, Authorized, Lockup, sendAndConfirmTransaction, StakeProgram, PublicKey } = require("@solana/web3.js");

const main = async() => {
    const connection = new Connection(clusterApiUrl('devnet'), 'processed');
    const wallet = Keypair.generate();

    const airdropSignature = await connection.requestAirdrop(
        wallet.publicKey, 
        1.5 * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature);

    const balance = await connection.getBalance(wallet.publicKey);
    console.log('Balance:' + balance);
    console.log('Public Key: ' + wallet.publicKey)

    const stakeAccount = Keypair.generate();
    const minimumRent = await connection.getMinimumBalanceForRentExemption(StakeProgram.space);
    const ammountUserWantsToStake = 0.5 * LAMPORTS_PER_SOL;
    const ammountToStake = minimumRent + ammountUserWantsToStake;

    const createStakeAccountTx = StakeProgram.createAccount({
        authorized: new Authorized(wallet.publicKey, wallet.publicKey),
        fromPubkey: wallet.publicKey,
        lamports: ammountToStake,
        lockup: new Lockup(0,0, wallet.publicKey),
        stakePubkey: stakeAccount.publicKey
    });
    
    const createStakeAccountTxId = await sendAndConfirmTransaction(connection, createStakeAccountTx, [wallet, stakeAccount]);

    console.log(`stake account creted. Tx Id: ${createStakeAccountTxId}`);
    let stakeBalance = await connection.getBalance(stakeAccount.publicKey);
    console.log(`Stake account balance: ${stakeBalance / LAMPORTS_PER_SOL} SOL`);

    let stakeStatus = await connection.getStakeActivation(stakeAccount.publicKey);
    console.log(`Stake account status: ${stakeStatus.state}`);

    const validators = await connection.getVoteAccounts();
    const selectedValidator = validators.current[0];
    const selectedValidatorPubkey = new PublicKey(selectedValidator.votePubkey);
    const delegateTx = StakeProgram.delegate({
        stakePubkey: stakeAccount.publicKey,
        authorizedPubkey: wallet.publicKey,
        votePubkey: selectedValidatorPubkey,
    });

    const delegateTxId = await sendAndConfirmTransaction(connection, delegateTx, [wallet]);
    console.log(`Stake account delegated to ${selectedValidatorPubkey}. Tx Id: ${delegateTxId}`);
    stakeStatus = await connection.getStakeActivation(stakeAccount.publicKey);
    console.log(`Stake account status: ${stakeStatus.state}`);
};

const runMain = async() => {
    try {
        await main();
    } catch(error){
        console.error(error);
    }
};

runMain();
