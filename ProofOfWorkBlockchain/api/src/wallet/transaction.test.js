const Transaction = require("./transaction")
const Wallet = require("./index")
const { verifySignature } = require("../utils")
const { REWARD_INPUT, MINING_REWARD } = require("../config")

describe("Transaction", () => {
    // only EOA/wallets should be able to make transactions
    let transaction, senderWallet, recipient, amount

    // crate a new instance of the wallet at each test
    beforeEach(() => {
        senderWallet = new Wallet()
        // public key of a dummy wallet - address
        recipient = 'recipient-public-key'
        amount = 50

        // create transaction instance
        transaction = new Transaction({ senderWallet, recipient, amount })
    })

    it("has an `id`", () => {
        expect(transaction).toHaveProperty("id")
    })

    // structure for the transaction that will have a key for each recipient that will correspond to the corresponding value
    // same as balances mapping in Solidity
    describe("outputMap", () => {
        it("has an `outputMap`", () => {
            expect(transaction).toHaveProperty("outputMap")
        })
        
        // mapping the recipient key of the transaction will give us the amount
        it("outputs the amount to the recipient", () => {
            expect(transaction.outputMap[recipient]).toEqual(amount)
        })

        // the address/publicKey of the sender mapped to the transaction will be the remaining balance after transaction
        it("outputs the remaining balance for the `senderWallet`", () => {
            expect(transaction.outputMap[senderWallet.publicKey])
                .toEqual(senderWallet.balance - amount)
        })
    })

    // transaction input that includes the signature
    describe("input", () => {
        it("has an `input`", () => {
            expect(transaction).toHaveProperty("input")
        })

        // transactions should record when they were created
        it("has a `timestamp` in the input", () => {
            expect(transaction.input).toHaveProperty("timestamp")
        })

        it("sets the `amount` to the `senderWallet` balance", () => {
            expect(transaction.input.amount).toEqual(senderWallet.balance)
        })

        it("sets the `address` to the `senderWallet` publicKey", () => {
            expect(transaction.input.address).toEqual(senderWallet.publicKey)
        })

        // sender wallet needs to sign the input
        it("signs the input", () => {
            expect(
                verifySignature({
                    publicKey: senderWallet.publicKey,
                    data: transaction.outputMap,
                    signature: transaction.input.signature
                })
            ).toBe(true)
        })
    })

    // validate transactions
    describe("validTransaction()", () => {
        // error log
        let errorMock

        beforeEach(() => {
            errorMock = jest.fn()

            global.console.error = errorMock
        })

        // where validTransaction() is a static method
        
        // VALID transaction => when no fields have been tampered with
        describe("when the transaction is valid", () => {
            
            it("returns true", () => {
                expect(Transaction.validTransaction(transaction))
                    .toBe(true)
            })
        })

        // INVALID
        describe("when the transaction is invalid", () => {

            // a. outputMap is invalid
            describe("and a transaction outputMap is invalid", () => {
                it("returns false and logs and error", () => {
                    // mess with the outputMap by sending a large amount of money
                    transaction.outputMap[senderWallet.publicKey] = 999999

                    expect(Transaction.validTransaction(transaction))
                        .toBe(false)

                    expect(errorMock).toHaveBeenCalled()
                })
            })

            // b. faked input signature
            describe("and the transaction input signature is invalid", () => {

                it("returns false and logs and error", () => {
                    // tamper with the signature with a new wallet
                    transaction.input.signature = new Wallet().sign("data")

                    expect(Transaction.validTransaction(transaction))
                        .toBe(false)

                    expect(errorMock).toHaveBeenCalled()
                })
            })

        })
    })

    // update transactions with multiple outputs
    // add a new amount to an existing recipient in the output map
    // input will have to be resigned 
    describe("update()", () => {

        // keep track of the original signature, original sender output and next amount and recipient
        let originalSignature, originalSenderOutput, nextRecipient, nextAmount

        // VALID - transaction doesnt exceed balance
        describe("and the amount is valid", () => {
            beforeEach(() => {
                // current transaction signature
                originalSignature = transaction.input.signature
                originalSenderOutput = transaction.outputMap[senderWallet.publicKey]
    
                // next data
                nextRecipient = "next-recipient"
                nextAmount = 50
    
                // update the transaction with the new signature from the new wallet
                transaction.update({
                    senderWallet,
                    recipient: nextRecipient,
                    amount: nextAmount
                })
            })
    
            it("outputs the amount to the next recipient", () => {
                expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount)
            })
    
            it("subtracts the amount from the original sender output amount", () => {
                expect(transaction.outputMap[senderWallet.publicKey])
                    .toEqual(originalSenderOutput - nextAmount)
            })
    
            it("maintains a total output that matches the input amount", () => {
              
                expect(
                      // accumulate the amount in outputMap
                    Object.values(transaction.outputMap)
                    .reduce((total, outputAmount) => total + outputAmount)
                   ).toEqual(transaction.input.amount)
            })
        
            it("re-signs the transaction", () => {
                // look at the actual value of the signature and have it not equal to the original signature
                expect(transaction.input.signature).not.toEqual(originalSignature)
            })

            // if update is done to same recipient]
            describe("and another upate for the same recipient", () => {
                let addedAmount

                beforeEach(() => {
                    addedAmount = 80
                    transaction.update({
                        senderWallet, recipient: nextRecipient, amount: addedAmount
                    })
                })

                it("adds to the recipient amount", () => {
                    expect(transaction.outputMap[nextRecipient])
                        .toEqual(addedAmount + nextAmount)
                })

                it("should subtract amount from original sender output amount", () => {
                    expect(transaction.outputMap[senderWallet.publicKey])
                        .toEqual(originalSenderOutput - nextAmount - addedAmount)
                })
            })
        })

        // INVALID - transaction exceeds balance
        describe("and the amount is invalid", () => {
            it("throws an error", () => {
               expect(() => {
                    transaction.update({
                        senderWallet, recipient: "example", amount: 99999
                    })
               }).toThrow("Amount exceeds balance")
            })
        })
    })

    // Mining reward
    describe("rewardTransaction()", () => {
        let rewardTransaction, minerWallet

        beforeEach(() => {
            minerWallet = new Wallet()
            // static method
            rewardTransaction = Transaction.rewardTransaction({ minerWallet })
        })
        
        it("creates a transaction with the reward input", () => {
            expect(rewardTransaction.input).toEqual(REWARD_INPUT)
        })

        it("creates one transaction for the miner with the `MINING_REWARD`", () => {
            expect(rewardTransaction.outputMap[minerWallet.publicKey]).toEqual(MINING_REWARD)
        })
    })
})