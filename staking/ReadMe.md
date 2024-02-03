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
