## Setting up Solana on a Windows machine.

This guide will walk you through the process of setting up the Solana environment on your local Windows machine. Please note that while Anchor does not currently support Windows, we'll leverage the Windows Subsystem for Linux (WSL) to create a Linux environment for Solana development.

### 👩‍💻 Setup WSL.

To utilize WSL, open `cmd.exe` in Admin mode and execute the following command:

```bash
wsl --install
```

This command installs the required components, downloads the latest Linux kernel, sets WSL 2 as default, and installs a Linux distribution (Ubuntu by default). 

**Restart your computer after the installation.**

You'll have to make a UN & PW for the new Ubuntu terminal.

### 📀 Installing Node.js.
Access the Ubuntu Terminal by searching for "Ubuntu" in your Start menu. 

Follow [this guide](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl) or use these commands to install Node.js using nvm:

```
// Install Curl
sudo apt-get install curl

// Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

// Restart Ubuntu Terminal

// Test if nvm exists - this will return "nvm" and not a version number if working correctly!
command -v nvm

// Install the latest version of Node.js
nvm install --lts
```

**
**Remember to run all terminal commands in the Ubuntu Terminal from now on.**
**

### 🦀 Install Rust.

Solana programs are written in Rust. Install Rust using the following command:

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

Verify the installation:

```bash
rustup --version
```

Then, make sure the rust compiler is installed:

```bash
rustc --version
```

Last, let's make sure Cargo is working as well. Cargo is the rust package manager.

```bash
cargo --version
```

If these commands output versions without errors, Rust is installed successfully.

### 🔥 Install Solana

Follow the steps [here](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool) to install the Solana CLI for Linux. 

After installation, run:

```bash
solana --version
```

```bash
solana config set --url localhost
```

```bash
solana config get
```

Ensure the configuration is set correctly.

### ☕️ Install Mocha.

Mocha is a testing framework for Solana programs. Install it using:

```bash
npm install -g mocha
```

### ⚓️ The magic of Anchor

To install Anchor, run:

```bash
npm install --global yarn
```

```bash
sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev libssl-dev
```

```bash
cargo install --git https://github.com/project-serum/anchor anchor-cli --locked
```

Verify the installation:

```bash
anchor --version
```

### 🏃‍♂️ Create a test project and run it.

Initialize a Solana project named `myepicproject`.

```bash
anchor init myepicproject --javascript
cd myepicproject
```

### 🔑 Create a local keypair.

Generate a local Solana wallet keypair:

```bash
solana-keygen new
```

This keypair functions as a local wallet for command-line interactions with Solana programs. 

If you run:

```bash
solana address
```

 You'll see the public address of your local wallet we just created.
