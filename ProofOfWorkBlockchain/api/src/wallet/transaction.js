const {v1: uuid}  = require("uuid")
const { verifySignature } = require("../utils")
const { REWARD_INPUT, MINING_REWARD } = require("../config")

class Transaction {
    constructor({senderWallet, recipient, amount, outputMap, input}) {
        this.id = uuid()
        this.outputMap = outputMap || this.createOutputMap({
            senderWallet, recipient, amount
        })

        // create the transaction input
        this.input = input || this.createInput({senderWallet, outputMap: this.outputMap})
    }

    createOutputMap({ senderWallet, recipient, amount }) {
        // initialize outputMap 
        const outputMap = {}

        // set the value of the recipient address as the amount being sent
        outputMap[recipient] = amount
        // deduct the amount to the sender's balance
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount

        return outputMap
    }

    createInput({senderWallet, outputMap}) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        }
    }

    // update transaction to have multiple outputs
    update({ senderWallet, recipient, amount }) {

        // check if amount > balance
        if (amount > this.outputMap[senderWallet.publicKey]) throw new Error("Amount exceeds balance")

        // check if recipient does not already exists
        if (!this.outputMap[recipient]) {
            // designate amount to new recipient
            this.outputMap[recipient] = amount
        } else {
            this.outputMap[recipient] += amount
        }

        // decrease balance of sender by amount
        this.outputMap[senderWallet.publicKey] -= amount

        // resign the transaction - reset input to new input with new signature
        this.input = this.createInput({ senderWallet, outputMap: this.outputMap })
    }

    // verify that the transaction is valid
    static validTransaction(transaction) {
        const { input: { address, amount, signature }, outputMap } = transaction

        // get a running total of the amount in the transaction - OUTPUT
        const outputTotal = Object.values(outputMap)
            .reduce((total, outputAmount) => total + outputAmount)

        // check if the INPUT amount is different than the running total OUTPUT
        if (amount !== outputTotal) {
            console.error(`Invalid transaction from ${address}`);
            return false
        }

        // check that the signature is from the correct address
        if (!verifySignature({publicKey: address, data: outputMap, signature})) {
            console.error(`Invalid signature from ${address}`);
            return false
        }

        return true
    }

    // need to override the standard outputMap and input with own hardcoded implementation for the miner rewards
    // as the rewards are not part of the signed transactions
    static rewardTransaction({ minerWallet }) {
        return new this({
            // override input and outputMap
            input: REWARD_INPUT,
            outputMap: {[minerWallet.publicKey]: MINING_REWARD} // one key and value (using a variable for a key)
        })
    }
}

module.exports = Transaction