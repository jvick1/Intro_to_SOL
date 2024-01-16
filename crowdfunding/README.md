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

## Section 7: Deploy our DApp on the Devnet

Navigate to your `anchor.toml` file and change these two lines, save, open a new terminal, and `cd` into crowdfunding:

```
cluster = "devnet"
wallet = "./id.json"
```

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/a0982a9b-de81-4d94-91ca-b3f0b06d8263)

After you save and have the new terminal open confirm you are in the crowdfunding project. Once ready let's generate a new wallet which we can use to deploy! If you get stuck at any point there is a screenshot in this section that shows all the terminal commands in this section. Let's start by generating a new key don't worry about passphrase, just press enter the following in your Ubuntu terminal:

```
solana-keygen new -o id.json
```

Copy your pubkey and let's airdrop it 2 SOL on devnet. Make sure you use your pubkey! My **Pubkey**: `HNfEtG17j2Hjd7Fjzgv1pMpW7i1EjjdD9iDEfyNZJvw6`. **Please note:** The devnet airdrop is capped at 2 Sol per request. To deploy it is a little over 2.9 SOL so this might take two days to fully deploy. 

```
solana airdrop 2 HNfEtG17j2Hjd7Fjzgv1pMpW7i1EjjdD9iDEfyNZJvw6 --url devnet
```

Once we have some SOL we can run: 

```
anchor build
``` 

This will generate a **Program ID** mine is `7YvhF9AKe4i7Zuha8NtqEuV2BDUqyGGqWiZvuVKdmYD` to generate yours type:

```
solana address -k ./target/deploy/crowdfunding-keypair.json
```

Below is a screenshot of my terminal window.

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/877d8d42-3c4b-463a-a4ae-1fff25c54f38)

Back in your anchor.toml file make sure your program id's match. 

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/6d70608f-fc3c-491f-a9f4-8c82381299b7)

And do the same for your `lib.rs` file:

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/41008a1b-6e6a-43f4-a5a1-57b4179df890)

Now let's deploy this app to devnet. This cost me around 2.9 SOL. If you already did you airdrop for today, sometimes you can request 1 SOL and half a SOL and it will still airdrop (sometimes), otherwise you can  send your wallet some SOL from one of the older projects if you have SOL left over there. Once you have the SOL it's time to deploy:

```
anchor deploy
```

![image](https://github.com/jvick1/Intro_to_SOL/assets/32043066/4cc955df-0561-4821-bc78-7f2b2921dff3)

Once deployed I can check it on devnet. Here is my Program ID: https://explorer.solana.com/address/7YvhF9AKe4i7Zuha8NtqEuV2BDUqyGGqWiZvuVKdmYD?cluster=devnet. At this point we have finished the backend for our app. Let's build a simple front end to finish this project off!

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

In this section, we'll leverage the Phantom wallet for our interaction. Phantom adds a Solana object to our browser, which we'll utilize to connect our DApp with users' Phantom wallets. If you've already set up Phantom, let's navigate to `frontend/src/App.js` in VScode. Trim down the boilerplate code, and let's define our App as a const. Here, we'll initiate the process of connecting the user's Solana Wallet to our DApp.

```
import './App.css';

const App = () => {

}

export default App;
```

This sets the foundation for integrating wallet connectivity into our DApp. Once a user connects their wallet, our website gains the authorization to execute functions from our Solana program on their behalf. It's important to note that without wallet connection, users won't be able to communicate with the Solana Blockchain through our DApp.
