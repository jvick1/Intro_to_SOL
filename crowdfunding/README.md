# Project #4: GoFundMe Web3 DApp

The primary objective of this project is to develop a **decentralized application (DApp) for crowdfunding**, akin to platforms like GoFundMe or Kickstarter, on the Solana blockchain. Users will have the ability to initiate crowdfunding campaigns for causes they support, with the entire process facilitated through smart contracts and program logic implemented on the Solana blockchain.

A Solana **program** is essentially a piece of code that executes on the Solana blockchain. However, due to the immutable nature of blockchain, programs cannot directly store data. Instead, they create **accounts** (similar to files) on the blockchain to store relevant data. The program retrieves necessary information from these accounts to execute its functions.

Building upon the concept of accounts, the project introduces the notion of **program-derived accounts**. In the context of crowdfunding, where funds need to be disbursed, these accounts play a crucial role. When funds are to be distributed, the crowdfunding account, being a program-derived account, seeks permission from a controlling program. This ensures a secure permissions process for transferring funds within the decentralized ecosystem.

## Section 1: Set-up

In this section, we will initialize and test an Anchor Project. Open a new terminal and navigate to where you want this project to be stored. Now let's create our project:

```
anchor init crowdfunding
```

Once initialized `cd` into the project.

```
cd crowdfunding
```

Key folders to know:
- `crowdfunding/programs/crowdfunding/src/lib.rs` is the default program that Anchor provides us.
- `crowdfunding/Cargo.toml` this file has the dependencies

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/6bcd50f1-fca3-487d-b37e-2008cfd5eb38)

Now let's build.  

```
 anchor build
```

What this `build` does is populate the `target` folder with `target/idl/crowdfunding.json`. This is the interface description language (idl) which describes the instructions from our Solana program. This is useful for test and front-end integration. Sometimes the build may fail like it did for me... if you are lucky and it finished first try move on to section 2. 

### Failed
I had an error on my first run. An error is different than a warning. To fix this error I added `ahash = "=0.8.6"` to the `Cargo.toml` file to fix the error. If you have an error fix it before moving on to creating your first function.

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/d1427240-d6b7-45bf-ac85-05ffefb9f5bc)

### Finished
If you didn't get an error your terminal should print out `Finished`. If you have successfully built your project let's move on to creating our first function. 

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/5ab6fa3d-ef9b-4228-ab16-6f6c745badf1)

## Section 2: `Create(...)` Campaign

Enter VScode and;
1. Enter Remote Explore
2. Connect and Navigate to the project
3. Enter `programs/crowdfunding/lib.rs`

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/fbc465e4-c2ec-4031-a83a-7695e204a927)

Let's remove some of the boilerplate code so we can start our function.

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/c53091f3-e3c2-4f66-a13e-781f94cfa125)

Let's now create our first function which will allow us to create a new campaign. A campaign in our context refers to something we can do crowdfunding for. Anyone can donate to a campaign and only  the campaign owner possesses the authority to withdraw funds from it. 

```
//src/lib.rs
use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("7YvhF9AKe4i7Zuha8NtqEuV2BDUqyGGqWiZvuVKdmYD");

#[program]
pub mod crowdfunding {
    use super::*;

    pub fn create(ctx: Context<Create>, name: String, description: String) -> ProgramResult {
        let campaign = &mut ctx.accounts.campaign;
        campaign.name = name;
        campaign.description = description;
        campaign.amount_donated = 0;
        campaign.admin = ctx.accounts.user.key;
        Ok(())
    }
}
```

This public function `create()` is client-callable, allowing external entities to invoke it. Here's a breakdown of its parameters and functionality:

- **First Argument (ctx):** The context argument is essential for gathering data about Solana accounts. As Solana programs are stateless, the context helps in specifying the necessary accounts for data retrieval.

- **Second Argument (name):** Represents a String indicating the name of the campaign.

- **Third Argument (description):** Another String providing additional details on the campaign.

- **Result (-> ProgramResult {}):** Specifies the return type of the function, aiding in handling results and errors. Ensure to include `use anchor_lang::solana_program::entrypoint::ProgramResult;` for proper execution.

Within the function, we retrieve our campaign account from the context using `let campaign = &mut ctx.accounts.campaign;`, indicating that we intend to modify this account. Subsequently, we update the campaign's name and description with user input, initialize the amount donated to zero, and set the admin as the user creating the campaign. Finally, `Ok(())` signals a successful execution of the function to Solana.

## Section 3: Account Definitions in the 'Create' Struct

Remember Solana Programs can't store data so any data that needs to be stored gets written into an account which is just like a file. The list of these accounts is our `Context<...>` for that function. So, the context of the `create(...)` function is the list of accounts it needs to retrieve data from. **What accounts will be part of the create functions context?**

**Below our crowdfunding module** let's define a struct named `Create` using the `#[derive(Accounts)]` macro attribute. In the context of Solana and Anchor framework, this struct represents the accounts that will be used as input to a particular program function. Let's break down the individual fields of this struct:

```
//src/lib.rs

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer = user, space = 9000, seeds=[b"CAMPAIGN_DEMO".as_ref(), user.key().as_ref()], bump)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}
```

- **`#[derive(Accounts)]`:** This attribute is used to automatically derive the implementation of the `Accounts` trait for the `Create` struct. The `Accounts` trait defines how account information is gathered and passed to an Anchor program function.

- **`pub campaign: Account<'info, Campaign>`:** This field specifies an account named campaign of type `Account<'info, Campaign>`. This account is initialized with the `init` attribute, indicating that it's a new account to be created. The payer is set to `user`, specifying that the user's account will be responsible for the transaction cost of creating this account. The `space` attribute determines the amount of space to allocate for this account on the Solana blockchain. The `seeds` attribute is used to derive the address of the account, and the `bump` attribute specifies a bump seed for uniqueness (ie someone might have that addy bump until you find an unused addy). 

- **`pub user: Signer<'info>`:** This field represents the user's account, marked as mutable (`mut`). The `Signer` trait indicates that this account must be a signer of the transaction, meaning the user must authorize the transaction for it to be valid.

- **`pub system_program: Program<'info, System>`:** This field specifies the system program, which is a part of the Solana blockchain. It is used to interact with system-level functionality. The `Program<'info, System>` type indicates that this is a program account associated with the Solana System Program.

In summary, the `Create` struct defines the accounts needed for a specific program function. The `campaign` account is a new account to be created, the `user` account is the signer of the transaction, and the `system_program` account is used for interacting with system-level features.


## Section 4: Campaign Struct

In this section, we will define the values in `Campaign` if you are not sure what values are included check out the `create(...)` function. Start by defining a Solana account struct named Campaign using the `#[account]` attribute. This code will go under our `Account` code. Let's break down the individual fields of this struct:

```
#[account]
pub struct Campaign {
    pub admin: Pubkey,
    pub name: String,
    pub description: String,
    pub amount_donated: u64
}
```

- **`pub admin: Pubkey`:** This field represents the public key (Pubkey) of the account's administrator. 

- **`pub name: String`:** This field holds a String representing the name of the campaign.

- **`pub description: String`:** This field holds a String providing additional details or a description of the campaign.

- **`pub amount_donated: u64`:** This field is of type u64 (unsigned 64-bit integer) and represents the total amount of funds donated to the campaign. It keeps track of the cumulative donations made to the campaign.

Now back in Umbutu, we can try to build our project again. My first try I got an error and had to add `*` to my `ctx`. Below in the screenshot you can see what the full `lib.rs` file should look like and the terminal results for an error and a successful build. 

```
anchor build
```

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/bd6a568b-b38a-43ea-9f98-448275c40d88)

## Section 5: Withdraw Function 

In this section, we introduce the `withdraw` function within our crowdfunding module, building upon the foundation laid by the `create` function. The `withdraw` function, declared as a public function, operates within the context of `<Withdraw>`. Key points about the `withdraw` function:

- It retrieves the `campaign` and `user` accounts from the context (`<Withdraw>`).
- It ensures that **only the admin can withdraw funds** by comparing the admin's public key with the user's key.
- It checks if there are **sufficient funds** in the campaign account for withdrawal.
- It calculates the minimum balance required to keep the campaign account active using the Rent API.
- If all checks pass, it deducts the specified amount from the campaign account and transfers it to the user's account.

```
 pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> ProgramResult {
     let campaign = &mut ctx.accounts.campaign;
     let user = &mut ctx.accounts.user;
     if campaign.admin != *user.key {
         return Err(ProgramError::IncorrectProgramId);
     }
     let rent_balance = Rent::get()?.minimum_balance(campaign.to_account_info().data_len());
     if **campaign.to_account_info().lamports.borrow() - rent_balance < amount {
         return Err(ProgramError::InsufficientFunds);
     }
     **campaign.to_account_info().try_borrow_mut_lamports()? -= amount;
     **user.to_account_info().try_borrow_mut_lamports()? += amount;
     Ok(())
 }
```

This code defines a struct named Withdraw using the #[derive(Accounts)] attribute. The Withdraw struct represents the accounts needed as inputs for a specific program function.

- **`#[derive(Accounts)]`:** This attribute is used to automatically derive the implementation of the `Accounts` trait for the `Withdraw` struct. The `Accounts` trait defines how account information is gathered and passed to an Anchor program function.

- **`pub campaign: Account<'info, Campaign>`:** This field specifies an account named `campaign` of type `Account<'info, Campaign>`. The `mut` attribute indicates that this account will be mutable, meaning it can be modified within the function. 

- **`pub user: Signer<'info>`:** This field represents the `user` account, marked as mutable (mut). The `Signer` trait indicates that this account must be a signer of the transaction, meaning the user must authorize the transaction for it to be valid. 

```
#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>
}
```

At this point, we can Build again to make sure everything is working. Below I provided a full screenshot of the code a the successful build of that code. 

```
anchor build
```

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/20d7d436-c7c9-41e7-b2f6-6b9f705c3bb8)

## Section 6: Donate Function (last function!)

This function will allow a user to donate to any campaign of their choice. In this function, we are going to transfer funds from a user's account to the campaign's account. **However, the way we transfer funds in this function will be different from the program-derived withdraw function because the program doesn't have authority over the user's wallet.** The user must sign that they want to transfer funds to this campaign. 

- We start things off with a system instruction `ix` which calls `transfer()`. This instruction takes in the user key, campaign key, and amount. 
- We then call `invoke()` which takes in system instructions, an array of accounts, and the transfer of funds.
- We end with `Ok(())` to let Solana know our program finished successfully. 

```
 pub fn donate(ctx: Context<Donate>, amount: u64) -> ProgramResult {
     let ix = anchor_lang::solana_program::system_instruction::transfer(
         &ctx.accounts.user.key(),
         &ctx.accounts.campaign.key(),
         amount
     );
     anchor_lang::solana_program::program::invoke(
         &ix,
         &[
             ctx.accounts.user.to_account_info(),
             ctx.accounts.campaign.to_account_info()
         ]
     );
     (&mut ctx.accounts.campaign).amount_donated += amount;
     Ok(())
 }
```

The accounts needed are campaign, user, and system program. Very similar to our `Create<...>` account.

```
#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}
```

And let's build again to make sure everything is working.

```
anchor build
```

Below is a screenshot to help you troubleshoot. Lines 34-49 and 69-76 are new.

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/e3906105-9b0e-4334-b7f4-fa98df173bed)

## Section 7: Deploying our DApp on the Devnet

To deploy our DApp on the Devnet, follow these steps:

1. Navigate to your `anchor.toml` file and update the following lines:

```
cluster = "devnet"
wallet = "./id.json"
```

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/a0982a9b-de81-4d94-91ca-b3f0b06d8263)


2. Save the changes, open a new terminal, and `cd` into the `crowdfunding` project. If not, navigate to it.

3. Generate a new wallet for deployment:

```
solana-keygen new -o id.json
```

Copy your public key, and let's airdrop 2 SOL on Devnet. Replace YOUR_PUBKEY with your actual public key: My **Pubkey**: `HNfEtG17j2Hjd7Fjzgv1pMpW7i1EjjdD9iDEfyNZJvw6`. 

```
solana airdrop 2 HNfEtG17j2Hjd7Fjzgv1pMpW7i1EjjdD9iDEfyNZJvw6 --url devnet
```

Please note that the Devnet airdrop is capped at 2 SOL per request. Deploying may take over 2.9 SOL, so it might span two days.

4. Once you have some SOL, run the following to build the project:

```
anchor build
``` 

This generates a Program ID. To find yours, type: My **Program ID**: `7YvhF9AKe4i7Zuha8NtqEuV2BDUqyGGqWiZvuVKdmYD`.

```
solana address -k ./target/deploy/crowdfunding-keypair.json
```

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/877d8d42-3c4b-463a-a4ae-1fff25c54f38)

Update the `anchor.toml` and `lib.rs` files with the respective Program IDs.

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/6d70608f-fc3c-491f-a9f4-8c82381299b7)


![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/41008a1b-6e6a-43f4-a5a1-57b4179df890)

5. Deploy the app to Devnet:

```
anchor deploy
```

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/4cc955df-0561-4821-bc78-7f2b2921dff3)

After deployment, check your Program ID on Devnet. Here's an example Program ID: [7YvhF9AKe4i7Zuha8NtqEuV2BDUqyGGqWiZvuVKdmYD](https://explorer.solana.com/address/7YvhF9AKe4i7Zuha8NtqEuV2BDUqyGGqWiZvuVKdmYD?cluster=devnet). Now, with the backend deployed, let's proceed to build a simple frontend to complete this project.

## Section 8: Front End React App

Make sure you are in the crowdfunding working directory and let's create what will be our front end:

```
npx create-react-app frontend
```

Now that we have created our react app let's `cd` into the frontend folder. 

```
cd frontend
```

Here we'll need to add some dependencies:

```
npm install --save @solana/web3.js
```

and the anchor library:

```
npm install --save @project-serum/anchor
```

Now, let's try running our app.

```
npm run start
```

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/6750c885-88ae-4a03-9eb9-a0ad415c6ab0)

And now we can start coding!

## Section 9: Establishing Wallet Connection

### 1. Intro to Code Structure
In this section, we'll leverage the Phantom wallet for our interaction. Phantom adds a Solana object to our browser, which we'll utilize to connect our DApp with users' Phantom wallets. If you've already set up Phantom, let's navigate to `frontend/src/App.js` in VScode. Trim down the boilerplate code, and let's define our App as a const. Here, we'll initiate the process of connecting the user's Solana Wallet to our DApp.

This sets the foundation for integrating wallet connectivity into our DApp. Once a user connects their wallet, our website gains the authorization to execute functions from our Solana program on their behalf. It's important to note that without wallet connection, users won't be able to communicate with the Solana Blockchain through our DApp. To check if the wallet is connected let's make an async await function that checks if the Solana object is in the window and if that wallet is connected to our app. 

```
//frontend/src/App.js

import './App.css';
import {useEffect} from "react";

const App = () => {
  const checkIfWalletIsConnected = async () => {
    try{
      const {solana} = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");
        }
      } else {
        alert("Solana object not found! Get a Phantom wallet");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const onLoad = async() => {
      await checkIfWalletIsConnected();
    }
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
};

export default App;
```

This code snippet employs an asynchronous `useEffect` hook to initiate the wallet connection check when the component loads. It ensures that our users have a seamless experience connecting their Phantom wallets to our DApp. For me, the try-catch was easy to understand but the `useEffect` was a little new. Here is a detailed breakdown of `useEffect`:

- `const onLoad = async () => { await checkIfWalletIsConnected(); };`: Defines an onLoad function that, when called, invokes the `checkIfWalletIsConnected` function.

- `window.addEventListener("load", onLoad);`: Attaches the `onLoad` function to the `load` event of the window. This ensures that the wallet connection check is performed when the component loads.

- `return () => window.removeEventListener("load", onLoad);`: Removes the event listener when the component unmounts. This cleanup is essential to prevent memory leaks.

- `}, []);`: The empty dependency array ensures that the useEffect hook runs only once when the component mounts. This is suitable for tasks like initializing and checking the wallet connection.

### 2. Testing if Solana Object is Found

Let's test this now. Refresh your browser hit f12 or right-click and inspect. If you closed your DApp go back to Ubuntu `cd` into crowdfunding, `cd` into frontend, and run `npm run start`. At this point check the console logs and you should see something like this:

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/362e05e6-18f8-48bb-b3a5-438917a427c0)

Nice! 

### 3. Wallet Authorization 

Next, we need to check if we are authorized to view the user's wallet. Once we have access we'll then get access to the functions on our Solana Program. To add this logic we'll add a few lines of code to the `if (solana.isPhantom)` section of our code just below `console.log("Phantom wallet found!");`. Here we'll add logic to connect to the wallet if trusted and then console log the wallet's public key:

```
 const response = await solana.connect({
   onlyIfTrusted: true,
 });
 console.log(
   "Connected with public key:",
   response.publicKey.toString()
 );
```

Below I have an image of the code and the new result we get in the console. **If you got an error here that is to be expected. We haven't authorized the connection yet.**

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/35df36fc-74b5-4d5c-975d-2fa72b4214fc)

### 4. Connect Wallet Logic  

In this section, we'll implement the logic to connect a user's wallet to our DApp. We'll create a connect wallet button with conditional rendering to manage the different states of our app. The goal is to display the "Connect to Wallet" button if the user is not connected and render the DApp once connected.

First, we define an asynchronous `connectWallet` function and render a button triggering this function. The button is displayed only if the user is not connected. To track the connection state, we use the `useState` hook, initializing `walletAddress` to `null`. This variable stores the user's wallet address once connected.

We then update the `checkIfWalletIsConnected` function to store the wallet address upon connection. The return statement in the `App` component is modified to render the app container only if no wallet address is found.

```
//frontend/src/App.js

import './App.css';
import {useEffect, useState} from "react";

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const checkIfWalletIsConnected = async () => {
    try{
      const {solana} = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");
          const response = await solana.connect({
            onlyIfTrusted: true,
          });
          console.log(
            "Connected with public key:",
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom wallet");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const connectWallet = async () => {
    const {solana} = window;
    if (solana) {
      const response = await solana.connect();
      console.log('Connected with public key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet}>Connect to Wallet</button>
  );
  useEffect(() => {
    const onLoad = async() => {
      await checkIfWalletIsConnected();
    }
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (<div className="App">{!walletAddress && renderNotConnectedContainer()}</div>);
};

export default App;
```

Once connected and approved you may need to refresh but you should get a console log like this:

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/c14654bb-107c-4b8f-9572-bfd4a825f3bc)

To test more go into phantom > settings > connected Apps > click app > disconnect. This will remove that app as a trusted app and allow you to reconnect with the button once page is refreshed.

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/b997a688-4d60-4e5d-9a94-74c26ffc9305)

## Section 10: Create a Campaign

Now that users can log in, let's empower them to create a campaign. The initial requirement is the `idl` file, generated during the `anchor build` command, located at `target/idl/crowdfunding.json`. This JSON file contains crucial information about our Solana program, such as function names and parameters, enabling seamless interaction between our web app and program. At the bottom, it holds the program ID, crucial for program interaction.

### 1. Setup

1. Copy the entire content of `target/idl/crowdfunding.json`.
2. Create a new file in `frontend/src/` named `idl.json`.
3. Paste the copied contents into `idl.json`.
4. In your `frontend/src/App.js`, import the following:

```
//frontend/src/App.js
import idl from './idl.json'
import {Connection, PublicKey, clusterApiUrl} from '@solana/web3.js'
import {Program, AnchorProvider, web3, utils, BN} from '@project-serum/anchor'
import {Buffer} from 'buffer';
window.Buffer = Buffer;
```

### 2. Get Provider

Now, let's create a provider—an authenticated connection to Solana. A wallet is essential for this connection, and we use `window.solana`. Keep in mind that any interaction with Solana, even data retrieval, requires a connected wallet. Phantom simplifies this process, offering users a secure and straightforward way to connect to Solana. We are going to be adding some lines of code to the `const App` right below `const [walletAddress, setWalletAddress] = useState(null);`:

```
const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new AnchorProvider(connection, window.solana, opts.preflightCommitment);
  return provider
};
```

Now, let's initialize some missing variables. Just above our `const App` component, we'll obtain the program ID, set our network to Devnet, and define options to pick when a transaction is confirmed. For instance, we are currently waiting for the node to confirm it, but we can opt to wait for the entire blockchain confirmation with `finalized`.

```
const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");
const opts = {
  preflightCommitment: "processed",
};
```

Below is a screenshot of my code in case you get stuck! The new lines added in this section are 18-22 `getProvider` and the `variables` in lines 9-14.

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/28b44de1-1b78-4b29-a03d-54547d349613)

### 3. Create Campaign Function 

Here is the layout of our function:

1. `const provider = getProvider();`: Fetches the provider from the Phantom wallet

2. `const program = new Program(idl, programID, provider);`: Creates a new instance of the Program class using the provided IDL, program ID, and the obtained provider.

3. `const [campaign] = PublicKey.findProgramAddressSync([...], program.programId);`: Generates a unique public key for the campaign account using the `findProgramAddressSync` method. The campaign account's uniqueness is based on the specified seeds, including the user's wallet public key.

4. `await program.rpc.create(...);`: Invokes the `create` method of the Solana program, passing in the required parameters. This method triggers the creation of a new campaign with the provided name, description, and account details. Note we can take user input here w/ something simple like `let campName = prompt("Please Enter Campain Name:");` then feed `campName` in for the hard-coded text.

5. `console.log('Created a new campaign w/ account:', campaign.toString());`: Logs a success message, indicating that a new campaign account has been successfully created.

6. `catch(error) { console.error('Error creating campaign account:', error); }`: Handles any errors that might occur during the process, logging an error message if an exception is caught.

```
const createCampaign = async () => {
   try{
     const provider = getProvider()
     const program = new Program(idl, programID, provider)
     const [campaign] = PublicKey.findProgramAddressSync([
       utils.bytes.utf8.encode("CAMPAIGN_DEMO"),
       provider.wallet.publicKey.toBuffer(),
     ],
     program.programId
     );
     await program.rpc.create('campaign name', 'campaign description', {
       accounts: {
         campaign,
         user: provider.wallet.publicKey,
         systemProgram: SystemProgram.programId,
       },
     });
     console.log('Created a new campaign w/ account:', campaign.toString());
   } catch(error) {
     console.error('Error creating campaign account:', error);
   }
 };
```

Now we need a way to call this function. Let's add a new button! We'll create a new container that appears once we have already connected our wallet. And we'll add a state for this in our return.

```
const renderConnectedContainer = () => (
  <button onClick={createCampaign}>Create a Campaign...</button>
);

//...

return (<div className="App">
  {!walletAddress && renderNotConnectedContainer()}
  {walletAddress && renderConnectedContainer()}
  </div>);
```

This should be what your code looks like now, please note that line 64 has been updated from methods to rpc. Methods worked for this step but rpc fixed an error I got next section. So stick with RPC that one is better.
![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/7708d691-b71b-47fa-b191-e73162da1412)

If you are getting an error like this do the following:
![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/c83e8e74-beee-4900-b724-33733d4526a7)

cd crowdfunding, cd frontend, `npm install --save assert`. I also had to add `npm install node-polyfill-webpack-plugin --save-dev`. **BE SURE TO DELETE YOUR CONNECTION AFTER CHANGING THE UNDERLYING CODE.**

After troubleshooting for like 30 min I finally got it to work. 
![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/9f0a5d16-4024-4470-a85b-8d40e82eafaf)


## Section 11: Display all campaigns 

Now that we've successfully created a campaign, the next step is to display it in our web app. We'll integrate the logic for fetching campaigns (`getCampaigns`) under the `connectWallet` function to ensure that campaigns are retrieved and ready for display.

```
const getCampaigns = async() => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = getProvider();
  const program = new Program(idl, programID, provider);
  Promise.all(
    (await connection.getProgramAccounts(programID)).map(
      async (campaign) => ({
        ...(await program.account.campaign.fetch(campaign.pubkey)),
        pubkey: campaign.pubkey,
      })
    )
  ).then((campaigns) => setCampaigns(campaigns));
};
```

1. **Connection Setup:** Here, a new Solana blockchain connection is established using the specified network (devnet) and preflight commitment option. The `connection` object is crucial for interacting with the Solana blockchain.
2. **Provider and Program Initialization:** The `getProvider()` function provides a Solana wallet provider, which is essential for making transactions. A new instance of the Anchor `Program` class is created. This class represents the Solana program we're interacting with, and it requires the program's ID (`programID`), the program's interface description language (`idl`), and the wallet provider.
3. **Fetching Campaign Accounts:** `connection.getProgramAccounts(programID)` retrieves all accounts associated with the specified program ID on the Solana blockchain. The `map` function is used to iterate over each fetched campaign account. For each campaign account, it fetches additional data using `program.account.campaign.fetch(campaign.pubkey)`. The spread operator (`...`) is used to merge this additional data with the existing properties of the campaign account. The result is an array of objects representing campaign accounts, each containing the fetched data and the public key (`pubkey`) of the campaign account.
4. **Updating State with Campaigns:** The `Promise.all` resolves with an array of campaign objects. The `setCampaigns` function  is called to update the component's state with the fetched campaigns.

This function fetches campaign accounts from the Solana blockchain, processes the data using the Anchor program, and updates the component's state with the retrieved campaigns.

Now we need to add a stateful variable at the top for campaigns, similar to what we did for `walletAddress`. So, at the top of your code where we declare our `App()` and then our `walletAddress` let's also add the following:

```
const [campaigns, setCampaigns] = useState([]);
```

And lastly, let's update our `renderConnectedContainer` to include the map of campaigns. 

```
const renderConnectedContainer = () => (
  <>
    <button onClick={createCampaign}>Create a Campaign...</button>
    <button onClick={getCampaigns}>Get a list of campaigns...</button>
    <br />
    {campaigns.map(campaign => (<>
      <p>Campaign ID: {campaign.pubkey.toString()}</p>
      <p>Balance: {(campaign.amountDonated / web3.LAMPORTS_PER_SOL).toString()}</p>
      <p>{campaign.name}</p>
      <p>{campaign.description}</p>

      <br />
      </>
    ))}
  </>
);
```

## Section 12: Donate to Campaign 

Let's now write the donate function. When you call the list of campaigns we'll add a donate button which on click will donate 0.2 SOL and we'll recall the `getCampaings()` function to refresh the balance. I put this section of code after my `createCampaing()`

```
const donate = async (publicKey) => {
   try {
     const provider = getProvider();
     const program = new Program(idl, programID, provider);

     await program.rpc.donate(new BN(0.2 * web3.LAMPORTS_PER_SOL), {
       accounts: {
         campaign: publicKey,
         user: provider.wallet.publicKey,
         systemProgram: SystemProgram.programId,
       },
     });
     console.log('Donated some money to:', publicKey.toString())
     getCampaigns();
   } catch(error) {
     console.error('Error donating:', error);
   }
 };
```

Next to the `renderConnectedContainer` function let's add the button. For me, I added this button under the description. 

```
 <button onClick = {() => donate(campaign.pubkey)}>
   Click to donate
 </button>
```

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/70f74052-3503-40ef-a2c2-b9c67689eaed)

## Section 13: Withdraw (the final section of this project!)

This is super easy and will almost be an exact copy of the `donate()` function. The key difference here is we'll call the `withdraw` method and we don't need `systemProgram` because it is only needed when sending funds from a user's wallet. 

```
const withdraw = async (publicKey) => {
   try {
     const provider = getProvider();
     const program = new Program(idl, programID, provider);

     await program.rpc.withdraw(new BN(0.2 * web3.LAMPORTS_PER_SOL), {
       accounts: {
         campaign: publicKey,
         user: provider.wallet.publicKey,
       },
     });
     console.log("Withdrew some money from:", publicKey.toString())
   }catch(error){
     console.error('Error withdrawing:', error);
   }
 };
```

And to be able to call this let's update our `renderConnectedContainer` again. I am just copy pasting the donate button and changing it to withdraw. 

```
 <button onClick = {() => withdraw(campaign.pubkey)}>
   Click to withdraw
 </button>
```

## Extra:

Now there are some limitations here. 
- A user can only make one campaign. How could they make more? Hint you'd need to change the Solana Program.
- Name and description are hard-coded 
- donate and withdraw are hard-coded
- Wouldn't it be cool if Campaign ID linked out to Solscan

The code in this repo will help you create the following end product:
I added some additional functionality, more console logs, and addressed some of the limitations mentioned above. 

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/3afa9d21-0e88-423f-b4af-d60f3d49e9d6)
