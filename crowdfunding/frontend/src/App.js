//frontend/src/App.js

import './App.css';
import idl from './idl.json';
import {Connection, PublicKey, SystemProgram, clusterApiUrl} from '@solana/web3.js';
import {Program, AnchorProvider, web3, utils, BN} from '@project-serum/anchor';
import {useEffect, useState} from "react";
import {Buffer} from 'buffer';
window.Buffer = Buffer;

const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");
const opts = {
  preflightCommitment: "processed",
};

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(connection, window.solana, opts.preflightCommitment);
    return provider;
  };
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

  const createCampaign = async () => {
    try{
      const provider = getProvider()
      const program = new Program(idl, programID, provider)

      //test area
      console.log("Provider Wallet PublicKey:", provider.wallet.publicKey.toBuffer())
      console.log("ProgramID:", program.programID);
      console.log("ProgramId:", program.programId);

      const [campaign] = PublicKey.findProgramAddressSync(
        [
          utils.bytes.utf8.encode("CAMPAIGN_DEMO"),
          provider.wallet.publicKey.toBuffer(),
        ],
      program.programId
      );

      let campName = prompt("Please Enter Campain Name:");
      let campDes = prompt("Please Enter Campain Descritpion:");

      await program.rpc.create(campName, campDes, {
          accounts: {
            campaign,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          }
        }
      )
      console.log('Created a new campaign w/ account:', campaign.toString());

    } catch(error) {
      console.error('Error creating campaign account:', error);
    }
  };

  const donate = async (publicKey) => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

      let donateSOL = parseFloat(prompt("Enter Amount $SOL to be donated:")); //phantom handles error on text

      await program.rpc.donate(new BN(donateSOL * web3.LAMPORTS_PER_SOL), {
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

  const withdraw = async (publicKey) => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

      let withdrawSOL = parseFloat(prompt("Enter Amount $SOL to be withdrew:"));

      await program.rpc.withdraw(new BN(withdrawSOL * web3.LAMPORTS_PER_SOL), {
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

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet}>Connect to Wallet</button>
  );
  const renderConnectedContainer = () => (
    <>
      <h1>Go Fund $SOL</h1>
      <button onClick={createCampaign}>Create a New Campaign</button>
      <button onClick={getCampaigns}>Explore Campaigns</button>
      <br />
      <div className="campaign-card-container">
        {campaigns.map((campaign, index) => (
        <div key={index} className="campaign-card">
        <h3>Campaign #{index}: {campaign.name}</h3>
        <p>{campaign.description}</p>
        <p>
          <strong>Balance:</strong> {(campaign.amountDonated / web3.LAMPORTS_PER_SOL).toString()} $SOL
        </p>
        <button onClick = {() => donate(campaign.pubkey)}>
          Donate
        </button>
        <button onClick = {() => withdraw(campaign.pubkey)}>
          Withdraw
        </button>
        <br />
        <h5>Campaign ID: <a href = {`https://solscan.io/account/${campaign.pubkey.toString()}?cluster=devnet`} target="_blank" rel="noopener noreferrer">
          {campaign.pubkey.toString()}
          </a></h5>
        </div>
      ))}
      </div>
    </>
  );


  useEffect(() => {
    const onLoad = async() => {
      await checkIfWalletIsConnected();
    }
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (<div className="App">
    {!walletAddress && renderNotConnectedContainer()}
    {walletAddress && renderConnectedContainer()}
    </div>);
};

export default App;
