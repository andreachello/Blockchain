const { STARTING_BALANCE } = require("../config")
const { ec, cryptoHash } = require("../utils")
const Transaction = require("./transaction")

class Wallet {
    constructor () {
        // set the balance equal to the starting balance 
        this.balance = STARTING_BALANCE

        // create a local key pair using ellitic cryptography
        this.keyPair = ec.genKeyPair()
        // generate the public key
        this.publicKey = this.keyPair.getPublic().encode("hex") // format in hexadecimal format
    }

    sign(data) {
        // need to hash the data before signing it - optimized hashed version of the data
        return this.keyPair.sign(cryptoHash(data))
    }

    createTransaction({ recipient, amount, chain}) {

        // as long as the chain is balance we ensure the transaction and balance is based
        // on the blockchain history
        if (chain) {
            // set the wallet balance to the calculated balance based on blockchain history
            this.balance = Wallet.calculateBalance({
                chain,
                address: this.publicKey
            })
        }

        // if the amount is greater than the balance
        if (amount > this.balance) throw new Error("Amount exceeds balance")
        
        // return instance of Transaction
        return new Transaction({ senderWallet: this, recipient, amount})
    }

    static calculateBalance({ chain, address }) {

        // keep track of a has conducted transaction boolean
        // if a wallet has made a transaction BY ITS INPUT ADDRESS then set to true
        // if true only include outputs within the transaction in the same block and after
        let hasConductedTransaction = false

        let outputsTotal = 0

        // iterate through the blocks of the chain - decrement until the genesis block
        for (let i=chain.length - 1; i>0 ; i--) {
            const block = chain[i]

            // look at every transaction in the block from top to bottom
            for (let transaction of block.data) {

                // check if the transaction input address to given address we know
                // that the wallet has made a transaction
                if (transaction.input.address === address) {
                    hasConductedTransaction = true
                }

                // the transaction output may be null however we only care about the
                // instances in which it is not null
                // we look at the output amount for the address at each block
                const addressOutput = transaction.outputMap[address]

                // if this is non-null we add it to the outputsTotal
                if (addressOutput) {
                    outputsTotal += addressOutput
                }
            }

            // stop the loop from adding transactions if wallet has conducted transactions
            if (hasConductedTransaction) {
                break
            }
        }

        
        return hasConductedTransaction ? outputsTotal // not include the starting balance
        : STARTING_BALANCE + outputsTotal // adding 0 if no outputs and the total if there are outputs
    }
}

module.exports = Wallet