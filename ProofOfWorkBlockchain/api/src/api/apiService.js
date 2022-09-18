const Blockchain = require("../blockchain")
const PubSub = require("../utils/pubsub.pubnub")
const TransactionPool = require("../wallet/transaction-pool")
const Wallet = require("../wallet")
const TransactionMiner = require("../wallet/transaction-miner")

const blockchain = new Blockchain()
const transactionPool = new TransactionPool()
const wallet = new Wallet()

const pubsub = new PubSub({ blockchain, transactionPool, wallet })

const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub })

const getBlocks = (done) => {
    // send the chain
    done(undefined, blockchain.chain)
}

const mineBlock = (data, done) => {
    // add the block
    blockchain.addBlock({ data })

    // broadcast new chain with added block
    pubsub.broadcastChain()
    
    done(undefined, "success")
}

const transact = (amount, recipient, done) => {
    
    // check if there is an existing transaction in the pool
    let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey })

    if (transaction) {
        // update the map with the existing transaction
        transaction.update({ senderWallet: wallet, recipient, amount})
    } else {
        // create the transaction
        transaction = wallet.createTransaction({ 
            recipient,
            amount, 
            chain: blockchain.chain
        })
    }

    // set transaction in transactionPool
    transactionPool.setTransaction(transaction)

    // broadcast transaction and update pool
    pubsub.broadcastTransaction(transaction)

    done(undefined, transaction)
}

const getTransactionPoolMap = (done) => {
    done(undefined, transactionPool.transactionMap)
}

const mineTransactions = (done) => {
    transactionMiner.mineTransactions()

    done(undefined, "success")
}

const getWalletInfo = (done) => {

    const address = wallet.publicKey

    done(
        undefined,
        {
            address,
            balance: Wallet.calculateBalance({
                chain: blockchain.chain,
                address
            })
        }
    )
}

// generate backend seed for development purposes
const walletOne = new Wallet()
const walletTwo = new Wallet()

const generateWalletTransaction = ({ wallet, recipient, amount}) => {
    const transaction = wallet.createTransaction({
        recipient, amount, chain: blockchain.chain
    })

    transactionPool.setTransaction(transaction)
}

const walletAction = () => generateWalletTransaction({
    wallet, recipient: walletOne.publicKey, amount: 5
})

const walletOneAction = () => generateWalletTransaction({
    wallet, recipient: walletTwo.publicKey, amount: 10
})

const walletTwoAction = () => generateWalletTransaction({
    wallet, recipient: wallet.publicKey, amount: 15
})

const seedBackend = () => {
    for (let i=0; i<20; i++) {
        if (i%3===0) {
            walletAction()
            walletOneAction()
        } else if (i%3===1) {
            walletAction()
            walletTwoAction()
        } else {
            walletOneAction()
            walletTwoAction()
        }
    
        transactionMiner.mineTransactions()
    }
} 

const getKnownAddresses = (done) => {
    // build a map of addresses by scanning the blockchain and looking for the addresses that 
    // have received or conducted a transatcion - unique addresses
    const addressMap = {}

    // every block in the chain
    for (let block of blockchain.chain) {
        // every transaction in the block
        for(let transaction of block.data) {
            // look at the keys of the transaction outputMap 
            const recipient = Object.keys(transaction.outputMap)

            // for each recipient set the addressMap of the recipient set to the recipient
            recipient.forEach(recipient => addressMap[recipient] = recipient)
        }
    }

    // set the array of the wallets
    done(undefined, Object.keys(addressMap))
}

const getBlock = (id, done) => {

    const { length } = blockchain.chain

    // get group of 5 blocks - most recent to oldest
    // make a copy of a revsered chain array as it is orignially last to recent
    // reverse mutates the original array so we can make a copy by using slice
    const blocksReversed = blockchain.chain.slice().reverse() 

    // we want to get 5 blocks per page
    let startIndex = (id-1) * 5
    let endIndex = id * 5

    // validate that the values are less than the chain length
    startIndex = startIndex < length ? startIndex : length
    endIndex = endIndex < length ? endIndex : length

    done(undefined, blocksReversed.slice(startIndex, endIndex))
}

const getChainLength = (done) => {
    done(undefined, blockchain.chain.length)
}

module.exports = {
    getBlocks,
    mineBlock,
    transact,
    getTransactionPoolMap,
    mineTransactions,
    getWalletInfo,
    seedBackend,
    getKnownAddresses,
    getChainLength, 
    getBlock
}