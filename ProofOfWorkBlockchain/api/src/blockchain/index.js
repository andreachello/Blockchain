const Block = require("./block")
const { cryptoHash } = require("../utils")
const { REWARD_INPUT, MINING_REWARD } = require("../config")
const Transaction = require("../wallet/transaction")
const Wallet = require("../wallet")

class Blockchain {

    constructor() {
        // initialize the blockchain with the genesis block
        this.chain = [Block.genesis()]
    }

    // add a new block containing the data - mining the block will add it to the chain
    addBlock({data}) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1], // the last block in this chain
            data
        })

        // add the newBlock to the chain
        this.chain.push(newBlock)
    }

    // chain validation return false if any rule has been violated
    static isValidChain(chain) {
        // check for genesis block
        // stringify as two objects cannot be stricly equal in
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false
        
        // check for invalid blocks and hash
        for (let i=1; i < chain.length; i ++) {
            // current block and all inputs
            const { timestamp, lastHash, hash, data, nonce, difficulty} = chain[i]

            // get lastHash
            const actualLastHash = chain[i - 1].hash

            // check that there are no difficulty jumps
            const lastDifficulty = chain[i-1].difficulty

            // check if lastHash in current block matches true hash of previous block
            if (lastHash !== actualLastHash) return false

            // validation of the hash
            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty)
            if (hash !== validatedHash) return false

            // no jumps too high nor too low
            if (Math.abs(lastDifficulty - difficulty) > 1) return false
        }
        return true
    }

    // method is based on an individual instance of the chain so not static
    // never replace chain when it contains INVALID transaction data
    replaceChain(chain, validTransactionData, onSuccess) {

        // will not replace if length of new chain is smaller
        if (chain.length <= this.chain.length) {
            console.error("Incoming chain must be longer")
            return
        }

        // do not replace when chain is invalid
        if (!Blockchain.isValidChain(chain)) {
            console.error("Incoming chain must be valid");
            return
        }

        // check value for transaction data
        // flag for if the transaction data is valid
        if (validTransactionData && !this.validTransactionData({ chain })) {
            console.error("The incoming chain has invalid data");
            return 
        }

        // callback for clearing mempool
        if (onSuccess) onSuccess()

        // replace the chain with the inputted chain
        console.log("Replacing chain with ", chain);
        this.chain = chain
    }

    // validate incoming instances of chains - cannot be static
    validTransactionData({ chain }) {
        // iterate through the chain and validate the data - skip genesis block
        for (let i=1; i<chain.length; i++) {
            const block = chain[i]

            // keep track of all the transactions in a block - set as a collection of unique data items
            const transactionSet = new Set()

            // only one reward per block
            let rewardTransactionCount = 0

            // ensure there is only one per block by iterating over the block
            for (let transaction of block.data) {
                // check if transaction is a reward transaction 
                // - input address is reward input address
                if (transaction.input.address === REWARD_INPUT.address) {
                    // increment reward count
                    rewardTransactionCount += 1

                    if (rewardTransactionCount > 1) {
                        console.error("Miner rewards exceed limit")
                        return false
                    }

                    // validate output map - AMOUNT - check if amount in reward transaction === real
                    // access all the values in the object and when it is a rewardTransaction
                    // there is only one item - if it is not equal to mining reward then error
                    if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
                        console.error("Miner reward amount is invalid")
                        return false
                    }
                } else {
                    // NOT a reward transaction
                    // check if the transaction is valid
                    if (!Transaction.validTransaction(transaction)) {
                        console.error("Invalid transaction")
                        return false
                    }

                    // Keep track of the true balance
                    const trueBalance = Wallet.calculateBalance({
                        // pass in the local chain and not the input chain as it is something the attacker can fake
                        chain:this.chain,
                        address: transaction.input.address
                    })

                    // validate if the attacker is trying to fake the balance
                    if (transaction.input.amount !== trueBalance) {
                        console.error("Invalid input amount")
                        return false
                    }

                    // validate for duplicate transactions
                    if (transactionSet.has(transaction)) {
                        console.error("An identical transaction appears more than once in the block");
                        return false
                    } else {
                        transactionSet.add(transaction)
                    }
                }
            }
        }

        return true
    }
}

module.exports = Blockchain