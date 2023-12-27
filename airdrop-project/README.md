# PROJECT #1: AIRDROP

If you've completed the "Setup WSL" section from the ReadMe.md in the Intro_to_SOL repo, you're ready to use the Ubuntu terminal configured during that setup. 
This project will guide you through the process of generating a new wallet, exploring its features and keys, checking the balance, and requesting an airdrop.

## Environment Set-up
Let's make the directory:

```
mkdir airdrop-project
```

Enter it:

```
cd airdrop-project
```

Generate an empty npm project:

```
npm init -y
```

Add the [Solana-Web3.js](https://docs.solana.com/developing/clients/javascript-api) library which aims to provide complete coverage of Solana

```
npm install --save @solana/web3.js
```

Now, let's go into your favorite IDE for this I am using VScode. 
In VScode head to your remote explorer (#1) and open it in a window (#2).

![image](https://github.com/jvick1/Rust_Intro/assets/32043066/678c7b13-e3f8-49f5-bc5b-d2f211bacdc1)

## Create Your Wallet

Now, let's create a new `index.js` file in our `airdrop-project`.

![image](https://github.com/jvick1/Rust_Intro/assets/32043066/0052cd6b-6d26-427f-bab2-d3ea1ed7e770)

Start by reading in the required packages:

```
//index.js
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js")
```

The `Keypair()` clause that we pulled in from `web3.js` allows us to make a new wallet. 
This wallet is where we will be airdropping out coins. 

```
const wallet = new Keypair()
```

## Retrieve Wallet's Credentials

Now that we have a wallet let's look at our public and secret keys. Make sure you never share your secret keys this is just a demo wallet.

To do this let's call `wallet._keypair.{KEY}` then `console.log()` them. 

```
//index.js
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js")

const wallet = new Keypair()

const publicKey = new PublicKey(wallet._keypair.publicKey)
const secretKey = wallet._keypair.secretKey

console.log(publicKey)
console.log(secretKey)
```

Web3.js has a class `PublicKey` let's create a `new` one on our current `publicKey`. 

## Get Balance of Wallet

IN PROGRESS...
