# PROJECT #2: CREATE & MINT YOUR OWN TOKEN

If you are following along you should already have Solana installed. 
First, do a `cd ..` just to make sure you are no longer in the `airdrop-project`. 
Now, let's confirm we have Solana installed. Recall, we did this in the top-level README.md file.

In our Ubuntu terminal type the following:

```
solana --version
```

If you get solana-cli followed by some numbers you are good! Else, follow the steps [here](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool) to install the Solana CLI for Linux. 

## SPL Token 

The SPL Token Rust crate is a software library developed for the Rust programming language to facilitate the creation and management of tokens on the Solana blockchain. This crate is an essential component of the Solana Programming Library (SPL) and provides developers with the tools and functionalities needed to interact with token-related operations, such as token creation, transfer, and account management. Leveraging the SPL Token Rust crate, developers can seamlessly integrate token functionality into their Solana-based decentralized applications, enabling the implementation of custom tokenized assets and decentralized financial solutions on the Solana blockchain.

```
cargo install spl-token-cli
```

This will take a few minutes to install.

## Create your Dev Wallet 

Let's set up our new wallet,

```
solana-keygen new
```

If you already have a wallet we can create a new one with `solana-keygen new --force` or you can use your existing wallet. For the Passphrase feel free to leave it blank. 
Overall, we just need the `pubkey` from the wallet (new or old). If you need a reminder of your `pubkey` type:

```
solana-keygen pubkey
```

For this example my pubkey is 6WEQAtXGEUUs6jDr5DTpwGeCQgaqAuBeYSGiPnRRBj1p. When I call this in the future just put your address in instead. 

Now maybe you want to check your $SOL balance on the devnet,

```
solana balance --url devnet
```

We can also check your wallet address (pubkey) on [Solana Explorer](https://explorer.solana.com/?cluster=devnet) or [Solscan](https://solscan.io/?cluster=devnet) just make sure you switch to DEVNET.

## Airdrop $SOL

Let's airdrop 2 $SOL to this new wallet on the devnet (be sure to enter your wallet):

```
solana airdrop 2 6WEQAtXGEUUs6jDr5DTpwGeCQgaqAuBeYSGiPnRRBj1p --url devnet
```

Now we can check this on one of our Solana Explorers -

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/b708fce6-8874-412f-ae60-c120afd74969)

## Create a Token

Now we are going to create a token with the SPL library. Creating a token is like creating the structure of the token while minting a token is making copies of that specific token. 

```
spl-token create-token --url devnet
```

Result:

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/e290f80e-1966-4d3f-a55c-b660643399d3)

***Make sure you copy the Address down this is how you can find additional info about your token.***

My token address is: 9eRq7qhj8GgBp2ytYnZD1DpyeuFgGtb15sfDfgiYTsL9

## Mint your Token

IN PROGRESS...
