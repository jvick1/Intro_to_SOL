# Stake your $SOL with JavaScript

## Section 1: Intro
Enter a new Umbuntu terminal and navigate to a folder of your choice.

```
mkdir staking
```

This folder will store all of our staking code. Now Cd into the folder.

```
cd staking
```

Then we will create a node project because we want to import the solana/web3.js library.  

```
npm init -y
```

Now we can also install the solana/web3.js library. 

```
 npm install --save @solana/web3.js
```

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/75387054-3495-4181-900f-38da979bef8a)

## Section 2: View Validators

Create a new file named `get_validators.js` and in this file, we are going to write some code that will allow us to get a list of validators. 

Solana validators serve as critical nodes in the blockchain's decentralized network, validating transactions and securing the system through a Proof-of-Stake (PoS) consensus mechanism. They play a key role in maintaining the integrity and efficiency of the Solana blockchain, contributing to its decentralized structure and providing opportunities for token holders to participate and earn rewards.

In the `get_validators.js` file, we will utilize a common structure for asynchronous JavaScript programs to enhance readability and manage errors effectively. This structure separates the main logic from the error-handling logic, resulting in more modular and maintainable code.

```
const main = async() => {
   //code will go here...
};

const runMain = async() => {
    try {
        await main();
    } catch(error){
        console.error(error);
    }
};

runMain();
```

Now we'll import the `Connection` class and the `clusterApiUrl` function from `solana/web3.js`. Within our main function, we'll establish a new connection to `devnet` using `clusterApiUrl` and the second parameter specifies the commitment level. In our case, we'll use `processed` which indicates the client wants to wait for a transaction to be included in a block that has been processed by the network. We'll then pull a list of `current` and `delinquent` validators (or voting accounts). Then we'll `console.log()` our results. We'll also print out an example validator with `current[0]`:

```
const { Connection, clusterApiUrl } = require("@solana/web3.js");

const main = async() => {
    const connection = new Connection(clusterApiUrl('devnet'), 'processed');
    const {current, delinquent} = await connection.getVoteAccounts();
    console.log('all validators: ' + current.concat(delinquent).length);
    console.log('current validators: ' + current.length);
    console.log(current[0]);
};

const runMain = async() => {
    try {
        await main();
    } catch(error){
        console.error(error);
    }
};

runMain();
```

Once these updates are made head back to your terminal and run the following:

```
node get_validators.js
```

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/f67e23d3-b963-4616-a775-70a04616402d)

## Section 3: Stake Account

A Solana stake account is a mechanism for users to contribute to the network's security and decentralization by locking up SOL tokens. By staking SOL in this account, users support the proof-of-stake consensus and earn rewards distributed by validators. This process not only enhances the network's robustness but also offers stakers a passive income through additional SOL token rewards.

Make a new js file `create_stake_account.js` and add the following code. Note the structure.

```
const { Connection, clusterApiUrl } = require("@solana/web3.js");

const main = async() => {
    const connection = new Connection(clusterApiUrl('devnet'), 'processed');
    //our stake account code will go here...
};

const runMain = async() => {
    try {
        await main();
    } catch(error){
        console.error(error);
    }
};

runMain();
```

We'll imagine we have a user who wants to stake some of his SOL. That user needs a wallet and some SOL. So, we'll create a `wallet` and `airdrop` some SOL. To generate the wallet add `Keypair`. Request an airdrop, wait for a confirmation, and then return the balance. Recall there is a rate limit of ~2 SOL every 24hrs.  

```
const { Connection, clusterApiUrl, LAMPORTS_PER_SOL, Keypair } = require("@solana/web3.js");

const main = async() => {
    const connection = new Connection(clusterApiUrl('devnet'), 'processed');
    const wallet = Keypair.generate();
    const airdropSignature = await connection.requestAirdrop(
        wallet.publicKey, 
        1 * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature);
    const balance = await connection.getBalance(wallet.publicKey);
    console.log('Balance:' + balance);
};

const runMain = async() => {
    try {
        await main();
    } catch(error){
        console.error(error);
    }
};

runMain();
```

Let's test this code before actually making the stake account. You should see the wallet balance printed out in the terminal something like 10000000ish  Lamports (or however much you airdropped). 

```
node create_stake_account.js
```

Now that we have some funds in the wallet we can set up the staked account.  It generates a new keypair for the stake account, calculates the minimum required rent, specifies the amount to stake, and creates a stake account transaction. The transaction is then sent and confirmed on the Solana network. The code prints the transaction ID, the stake account's balance in SOL, and its activation status. This process allows users to stake SOL tokens, contributing to network security and earning rewards while monitoring the account's status. Note: the addition of StakeProgram in the required packages. 

```
const { Connection, clusterApiUrl, LAMPORTS_PER_SOL, Keypair, Authorized, Lockup, sendAndConfirmTransaction, StakeProgram } = require("@solana/web3.js");

const main = async() => {
    const connection = new Connection(clusterApiUrl('devnet'), 'processed');
    const wallet = Keypair.generate();

    const airdropSignature = await connection.requestAirdrop(
        wallet.publicKey, 
        1 * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature);

    const balance = await connection.getBalance(wallet.publicKey);
    console.log('Balance:' + balance);

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
};

const runMain = async() => {
    try {
        await main();
    } catch(error){
        console.error(error);
    }
};

runMain();
```

When you run this code the end result should be something like this:

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/79c71d4f-15fc-41b1-b339-2bac341237c6)

## Section 4: Delegate Your Stake

At this point let's create a new file named `delegate_stake.js` and copy-paste all of our contents from `create_stake_account.js`. 

## Section 5: Check Delegators 

## Section 6: Deactivate

## Section 7: Withdraw

Now let's open our `package.json` in VScode and make the following change `"type": "module",`.

```
{
  "name": "staking",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@solana/web3.js": "^1.89.1"
  }
}
```
