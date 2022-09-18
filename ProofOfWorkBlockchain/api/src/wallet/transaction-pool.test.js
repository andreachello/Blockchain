const TransactionPool = require("./transaction-pool")
const Transaction = require("./transaction")
const Blockchain = require("../blockchain")
const Wallet = require("./index")

describe("TransactionPool", () => {
    let transactionPool, transaction, senderWallet

    beforeEach(() => {
        // new instance
        transactionPool = new TransactionPool()
        senderWallet = new Wallet(),
        transaction = new Transaction({
            senderWallet,
            recipient: "example-recipient",
            amount: 50
        })
    })

    describe("setTransaction()", ()  => {
        it("adds a transaction", () => {
            transactionPool.setTransaction(transaction)
            expect(transactionPool.transactionMap[transaction.id])
                .toBe(transaction) // exact transaction object 
        })
    })

    describe("existingTransaction()", () => {
        it("returns an existing transaction given an input address", () => {
            // set the transaction in the transaction pool
            transactionPool.setTransaction(transaction)

            // the transaction for the address of the wallet should be equal to the transaction alraedy mapped in the pool
            expect(
                transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey })
            ).toBe(transaction)
        })
    })

    // Validate transactions - build a local array of valid transactions
    describe("validTransactions()", () => {
        let validTransactions, errorMock

        beforeEach(() => {
            validTransactions = []
            errorMock = jest.fn()
            global.console.error = errorMock

            // iterate over transactions and include some invalid ones and push only the valid ones
            for (let i=0; i<10; i++) {
                transaction = new Transaction({
                    senderWallet,
                    recipient: "any-recipient",
                    amount: 30
                })
    
                // invalidate some transactions
                if (i % 3 === 0) {
                    // invalid amount
                    transaction.input.amount = 999999
                } else if (i % 3 === 1) {
                    // invalid signature
                    transaction.input.signature = new Wallet().sign("invalid") // not matching 
                } else {
                    validTransactions.push(transaction)
                }
    
                // set the transaction in the mempool/transaction pool
                // regardless of if it has been tampered with
                transactionPool.setTransaction(transaction)
            }

        })

        it("returns valid transactions", () => {
            expect(transactionPool.validTransactions()).toEqual(validTransactions)
        })

        it("logs errors for invalid transactions", () => {
            transactionPool.validTransactions()
            expect(errorMock).toHaveBeenCalled()
        })
    })

    // clear transaction pool
    describe("clear()", () => {
        it("clears the transactions", () => {
            transactionPool.clear()

            expect(transactionPool.transactionMap).toEqual({})
        })
    })

    // clear blockchain transactions - only clear mempool if they are included in chain
    describe("clearBlockchainTransactions()", () => {
        it("clears the pool of any existing blockchain transactions", () => {
            const blockchain = new Blockchain()
            // the transactions not being pushed to the local blockchain
            const expectedTransactionMap = {}

            for (let i=0; i<6; i++) {
                
                // create new transaction at each iteration
                const transaction = new Wallet().createTransaction({
                    recipient: "example-recipient",
                    amount: 20
                })

                // set the transaction in the transaction pool
                transactionPool.setTransaction(transaction)

                // add block with a data array of transactions to the blockchain (half of the time) - other half in the expected map
                if (i % 2 === 0) {
                    blockchain.addBlock({ data: [transaction]}) // add to local blockchain with the transaction
                } else {
                    expectedTransactionMap[transaction.id] = transaction 
                }
            }

            // clear the transactions and the only transactions present should be the expected transactions
            transactionPool.clearBlockchainTransactions({ chain: blockchain.chain })

            expect(transactionPool.transactionMap).toEqual(expectedTransactionMap)
        })
    })
})