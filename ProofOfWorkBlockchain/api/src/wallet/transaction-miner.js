const Transaction = require("../wallet/transaction")

class TransactionMiner {
    
    constructor ({ blockchain, transactionPool, wallet, pubsub }) {
        this.blockchain = blockchain
        this.transactionPool = transactionPool
        this.wallet = wallet
        this.pubsub = pubsub
    }

    mineTransactions() {

        // 1. Get the mempool's valid transactions
        const validTransactions = this.transactionPool.validTransactions()

        // 2. Generate the miner's reward
        // push the reward transaction in the valid transaction array with the wallet used to mine the block
        validTransactions.push(
            Transaction.rewardTransaction({ minerWallet: this.wallet })
        )

        // 3. Add block consisting of these transactions to the blockchain
        this.blockchain.addBlock({ data: validTransactions })

        // 4. Broadcast the updated blockchain
        this.pubsub.broadcastChain()

        // 5. Clear the pool - To prevent the submission of transactions that have already been included in the chain
        this.transactionPool.clear()
    }
}

module.exports = TransactionMiner