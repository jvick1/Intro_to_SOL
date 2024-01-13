# Project #4: GoFundMe Web3 DApp

## Section 0: Overview

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

Let's now create our first function which will allow us to create a new campaign. A campaign is something we can do crowdfunding for. Anyone can donate to a campaign and only the owner of the campaign can withdraw funds from that campaign. 

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

Here we made a public `pub` function `fn` named `create()` which can be invoked from our program. In other words, it's a client-callable program function. 

The **first argument** for an anchor program is always the context `ctx` argument which tells the Program what Solana accounts we need to gather data. **If you don't remember what accounts are check out some of the earlier projects in this repo.** TLDR in Solana programs are stateless (can't store data) so if you want to store data on the Solana Blockchain we have to create an account which is like a file and put that account on the Blockchain. Then from our program using code we grab the data from that account. 

The **second argument** is `name` which is a `String` that tells us the name of the campaign. 

The **third parameter** is `description` which is also a `String` but allows the creator to provide more details on the campaign. 

The **result** `-> ProgramResult {}` tells the function what it should return. This helps serve function results and catch errors. Be sure to add `use anchor_lang::solana_program::entrypoint::ProgramResult;` to successfully run this code. 

**Inside the function** we are going to retrieve our **campaign** **accounts** from our **context** `let campaign = &mut ctx.account.campaign;` and we specify `&mut` because we are going to modify this account. We modify it in the next few lines when we set the campaign name & description to user input, initialize the amount donated, and set the admin to the user creating the campaign. Lastly, we use `Ok(())` to let the Solana know that our function has run successfully. 

## Section 3: Specify the `Context<...>` in our `create(...) function

Remember Solana Programs can't store data so any data that needs to be stored gets written into an account which is just like a file. The list of these accounts is our `Context<...>` for that function. So, the context of the `create(...)` function is the list of accounts it needs to retrieve data from. **What accounts will be part of the create functions context?**

```

```


Under our crowdfunding module, we'll create a new structure `struct` called `Create<'info>`. Above it we define a macro used to derive accounts `#[derive(Accounts)]` this `#` indicates that it is a context. 





