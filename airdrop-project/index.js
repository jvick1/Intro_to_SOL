//follow the steps in the README.md file before running this
//you'll need the default project and packages downloaded in the 'Environment Set-up` section

const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js")

const wallet = new Keypair()

const publicKey = new PublicKey(wallet._keypair.publicKey)
//const secretKey = wallet._keypair.secretKey

//console.log(publicKey.toString())
//console.log(secretKey)

const getWalletBalance = async() => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
        const walletBalance = await connection.getBalance(publicKey) 
        console.log(`Wallet: ${publicKey.toString()} \nBalance: ${walletBalance / LAMPORTS_PER_SOL} $SOL`)
    } catch(err) {
        console.error(err)
    }
}

const airDropSol = async() => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
        const fromAirDropSignature = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL)
        await connection.confirmTransaction(fromAirDropSignature)
    } catch(err) {
        console.log(err)
    }
}

const main = async() => {
    await getWalletBalance()
    await airDropSol()
    await getWalletBalance()
}

main()
