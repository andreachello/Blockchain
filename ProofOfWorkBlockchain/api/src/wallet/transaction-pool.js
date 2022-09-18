const Transaction = require("./transaction")

class TransactionPool {
    constructor() {
        this.transactionMap = {

        }
    }

    setTransaction (transaction) {
        // the mapped value of the transaction id will equal the transaction
        this.transactionMap[transaction.id] = transaction
        
    }

    clear() {
        this.transactionMap = {}
    }

    setMap(transactionMap) {
        // set the location transaction map to the incoming transactio map
        this.transactionMap = transactionMap
    }

    existingTransaction({ inputAddress }) {
        // get array of all transactions in map
        const transactions = Object.values(this.transactionMap)

        // find the transaction with the provided address
        return transactions.find(transaction => transaction.input.address === inputAddress)
    }

    // returns all valid transactions in mempool
    validTransactions() {
        // get array of all transactions in the map
        return Object.values(this.transactionMap).filter(
            // for any transaction that is valid
            (transaction) => Transaction.validTransaction(transaction) 
        )
    }

    // method called by peers when they accept a new chain to replace the old chain 
    clearBlockchainTransactions({ chain }) {
        // iterate - skipping genesis block - and look at each block's transaction
        for (let i = 0; i < chain.length; i++) {
            // get the current block in the iteration
            const block = chain[i]

            // go through every transaction in the block data
            // delete the transactions in the block if it is included in the transactionMap
            for (let transaction of block.data) {
                if (this.transactionMap[transaction.id]) {
                    delete this.transactionMap[transaction.id]
                }
            }
        }
    }
}

module.exports = TransactionPool