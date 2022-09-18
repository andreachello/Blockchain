const Wallet = require("./index")
const { verifySignature } = require("../utils")
const Transaction = require("./transaction")
const Blockchain = require("../blockchain")
const { STARTING_BALANCE } = require("../config")

describe("Wallet", () => {
    let wallet
    
    beforeEach(() => {
        wallet = new Wallet()
    })

    it("has a `balance`", () => {
        expect(wallet).toHaveProperty("balance")
    })
    
    it("has a `publicKey`", () => {
        expect(wallet).toHaveProperty("publicKey")
    })

    // signing data - do not accept any transaction just the signed ones
    describe("signing data", () => {
        const data = "signing data"

        it("verifies a signature", () => {
            expect(
                // use elliptic to decrypt the original data using the key, data and signature
                // if the decrypted data does not match the data then it is invalid
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: wallet.sign(data)
                })
            ).toBe(true)
        })

        it("does not verify an invalid signature", () => {
            expect(
                // different wallet signature 
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: new Wallet().sign(data)
                })
            ).toBe(false)
        })
    })

    // Wallet creates a transaction
    // to create a transaction we need a sender wallet, amount and recipient 
    describe("createTransaction()", () => {

        // Amount cannot exceed wallet balance
        describe("and the amount exceeds the balance", () => {
            it("throws an error", () => {
                expect(() => wallet.createTransaction({ amount: 99999, recipient: "example-recipient"}))
                    .toThrow("Amount exceeds balance")
            })
        })

        // Amount does not exceed wallet balance
        describe("and the amount is valid", () => {

            let transaction, amount, recipient

            beforeEach(() => {
                amount = 50
                recipient = "example-recipient"
                transaction = wallet.createTransaction({ amount, recipient })
            })

            it("creates an instance of `Transaction`", () => {
                expect(transaction instanceof Transaction).toBe(true)
            })

            it("matches the transaction input with the wallet's input", () => {
                expect(transaction.input.address).toEqual(wallet.publicKey)
            })

            it("outputs the amount to the recipient", () => {
                expect(transaction.outputMap[recipient]).toEqual(amount)
            })
        })

        // calculate wallet balance after each transaction
        describe("and a chain is passed", () => {
            it("calls `Wallet.calculateBalance`", () => {
                // get the current calculate balance method
                const originalCalculateBalance = Wallet.calculateBalance

                // use the fn method to check the method is being called 
                const calculateBalanceMock = jest.fn()

                Wallet.calculateBalance = calculateBalanceMock

                // create a transaction
                wallet.createTransaction({
                    recipient: "example-recipient",
                    amount: 10,
                    chain: new Blockchain().chain
                })

                expect(calculateBalanceMock).toHaveBeenCalled()

                // restore the calculate balance method
                Wallet.calculateBalance = originalCalculateBalance
            })
        })
    })

    // balance calculation
    // balance is calculated by summing all outputs of a particular wallet
    describe("calculateBalance()", () => {
        let blockchain

        // set new blockchain instance for each test
        beforeEach(() => {
            blockchain = new Blockchain()
        })

        // Case 1: No output
        describe("and there are no outputs for the wallet", () => {
            it("returns the `STARTING_BALANCE`", () => {
                // the balance should be the starting balance as there are no outputs
                // for the transfer/transactions
               expect(
                Wallet.calculateBalance({
                    chain: blockchain.chain,
                    address: wallet.publicKey
                })
               ).toEqual(STARTING_BALANCE)
            })
        })

        // if there are outputs
        describe("and there are outputs for the wallet", () => {
            // make transactions
            let transactionOne, transactionTwo

            beforeEach(() => {
                transactionOne = new Wallet().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 50
                })

                transactionTwo = new Wallet().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 60
                })

                // record the transaction in the chain
                blockchain.addBlock({ data: [transactionOne, transactionTwo] })
            })

            it("adds the sum of all outputs to the wallet balance", () => {
               expect(
                Wallet.calculateBalance({
                    chain: blockchain.chain,
                    address: wallet.publicKey
                })
               ).toEqual(
                STARTING_BALANCE +
                // get amount from the transaction outputMaps with key being the wallet
                transactionOne.outputMap[wallet.publicKey] +
                transactionTwo.outputMap[wallet.publicKey] 
                )
            })
        })

        // no double counting if the wallet has made a transaction
        describe("and the wallet has made a transaction", () => {
            let recentTransaction

            // make sure the wallet makes the transaction
            beforeEach(() => {
                recentTransaction = wallet.createTransaction({
                    recipient: "example-address",
                    amount: 30
                })

                // record transaction in the blockchain
                blockchain.addBlock({ data: [recentTransaction]})
            })

            it("returns the output amount of the recent transaction", () =>{
                expect(
                    Wallet.calculateBalance({
                        chain: blockchain.chain,
                        address: wallet.publicKey
                    })
                ).toEqual(recentTransaction.outputMap[wallet.publicKey])
            })

            // make sure that any outputs in the block with the recent transactions 
            // and after it are still calculated as part of the balance
            // - any new outputs are valid -  until the wallet makes another transaction

            describe("and there are outputs next to and after the recent transatcion", () => {
                let sameBlockTransaction, nextBlockTransaction

                beforeEach(() => {
                    // reassign the recent transaction so there is a new transaction to be recorded
                    recentTransaction = wallet.createTransaction({
                        recipient: "later-example-address",
                        amount: 60
                    })

                    // the same block transaction is going to be more relevant
                    // for a reward transaction  - it does not just appear when a wallet
                    // is making the same transaction in the same block
                    sameBlockTransaction = Transaction.rewardTransaction({ minerWallet: wallet })

                    // add the transactions
                    blockchain.addBlock({ data: [recentTransaction, sameBlockTransaction] })

                    // NEXT BLOCK transaction
                    // a new wallet is going to make this transaction and the local wallet to 
                    // receive as we are testing the local wallet can receive transactions
                    // after its most recent transaction
                    nextBlockTransaction = new Wallet().createTransaction({
                        recipient: wallet.publicKey,
                        amount: 75
                    })

                    // add this transaction to the chain
                    blockchain.addBlock({ data: [nextBlockTransaction] })
                })

                it("includes the output amounts in the returned balance", () => {
                    expect(
                        Wallet.calculateBalance({
                            chain: blockchain.chain,
                            address: wallet.publicKey
                        })
                    ).toEqual(
                        recentTransaction.outputMap[wallet.publicKey] +
                        sameBlockTransaction.outputMap[wallet.publicKey] +
                        nextBlockTransaction.outputMap[wallet.publicKey]
                    )
                })
            })
        })
    })
})