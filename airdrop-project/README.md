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

Back to your Ubuntu terminal let's run the `index.js` file

```
node index.js
```

The result should be something like this:

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/a992047a-b855-4052-8c9b-e4c4a497d6ea)

The `Uint8Array(32)` is your public and `Uint8Array(64)` is your secret key. 

*TIP: We could also do `console.log(publicKey.toString())` which will show us the wallet address you typically see on Phantom Wallet.*

## Get Balance of Wallet

In this section, we'll craft an asynchronous function utilizing the `async/await` syntax. 
This function is designed to establish a connection with the Solana devnet and retrieve the current balance associated with our wallet. 
To enhance the robustness of our code, we'll encapsulate the entire process within a try-catch block, adhering to best practices for error handling.
At this point feel free to comment out the two console logs we made in the last step.

```
//index.js

const getWalletBalance = async() => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
        const walletBalance = await connection.getBalance(publicKey) 
        console.log(`Wallet: ${publicKey.toString()} \nBalance: ${walletBalance / LAMPORTS_PER_SOL} $SOL`)
    } catch(err) {
        console.error(err)
    }
}
```

The big thing to note here is that the wallet balance would return in lamports so we can divide by `LAMPORTS_PER_SOL` to get our $SOL result.

Now we just need a new function `main` that will call `getWalletBalance()` and trigger our code to run.

```
//index.js

const main = async() => {
    await getWalletBalance()
}

main()
```

The final result should look something like this:

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

const getWalletBalance = async() => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
        const walletBalance = await connection.getBalance(publicKey) 
        console.log(`Wallet: ${publicKey.toString()} \nBalance: ${walletBalance / LAMPORTS_PER_SOL} $SOL`)
    } catch(err) {
        console.error(err)
    }
}

const main = async() => {
    await getWalletBalance()
}

main()

```

In summary, this script initializes a Solana wallet, fetches its balance from the Solana devnet, and logs the wallet's public key and balance to the console. It also includes error handling to manage potential issues during the process.
It does so with an asynchronous `main` function that calls `getWalletBalance`. The `main` function is invoked, triggering the process of connecting to the Solana devnet and retrieving the wallet balance.
At this point, our wallet should return 0. Next, let's airdrop some $SOL to the wallet and see how things change.

## Airdrop yourself some SOL

NOTE: This can be done once every 24hrs!

IN PROGRESS....