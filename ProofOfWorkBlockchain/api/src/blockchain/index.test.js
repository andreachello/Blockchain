const Blockchain = require("./index")
const Block = require("./block")
const { cryptoHash } = require("../utils")
const Wallet = require("../wallet")
const Transaction = require("../wallet/transaction")

describe("Blockchain", () => {
    let blockchain, newChain, originalChain, errorMock

    // fresh instance of the blockchain for each test
    beforeEach(() => {
        blockchain = new Blockchain()
        newChain = new Blockchain()
        errorMock = jest.fn();

        // copy of the chain before it is replaced (memoize it)
        originalChain = blockchain.chain
        global.console.error = errorMock;
    })

    it("contains a `chain` Array instance", () => {
        expect(blockchain.chain instanceof Array).toBe(true)
    })

    it("starts with the genesis block", () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis())
    })

    it("adds a new block to the chain", () => {
        // create new data to be added
        const newData = 'foo bar'
        blockchain.addBlock({data: newData})

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData)
    })

    // --------------------
    // Chain Validation
    // --------------------
    describe("isValidChain()", () => {

        // No genesis block at start
        describe("when the chain does not start with the genesis block", () => {
            it("returns false", () => {
                // set genesis block to fake block
                blockchain.chain[0] = {data: "fake-genesis"}
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
            })
        })

        // Genesis block at start
        describe("when the chain starts with the genesis block and has multiple blocks", () => {

            // add multiple blocks for each new instance of the blockchain
            beforeEach(() => {
                 // add blocks
                 blockchain.addBlock({data: "Bears"})
                 blockchain.addBlock({data: "Beets"})
                 blockchain.addBlock({data: "Battlestar Galactica"})
            })

            // the chain may have an invalid block
            describe("and a lastHash reference has changed", () => {
                it("returns false", () => {
                   
                    // change the last hash reference of one of the blocks
                    blockchain.chain[2].lastHash = "broken-lastHash"

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
                })
            })

            // the chain may have been tampered with (invalid inputs)
            describe("and the chain contains a block with an invalid field", () => {
                it("returns false", () => {

                    // change the field of one of the blocks
                    blockchain.chain[2].data = "broken-data"

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
                })
            })

            // jump in difficulty - check to prevent malicious agents to manipulate the difficulty manually
            describe("and the chain contains a block with a jumped difficulty", () => 
                it("returns false", () => {
                    const lastBlock = blockchain.chain[blockchain.chain.length - 1]
                    const lastHash = lastBlock.hash
                    const timestamp = Date.now() 
                    const nonce = 0
                    const data = []

                    // set difficulty to an arbitrary jumped value
                    const difficulty = lastBlock.difficulty - 3

                    // generate new hash including the jumped difficulty value
                    const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data)

                    // create a bad block with attacked hash and push it to the chain
                    const badBlock = new Block({
                        timestamp,
                        lastHash,
                        hash,
                        nonce,
                        difficulty,
                        data
                    })

                    blockchain.chain.push(badBlock)

                    // not valid chain
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)

                })
            )

            // No invalid blocks
            describe("and the chain does not contain any invalid blocks", () => {
                it("returns true", () => {

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true)
                })
            })
        })
    })

    // --------------------
    // Chain Replacement
    // --------------------
    describe("replaceChain()", () => {

        // use mocks to not print to terminal (stub)
        let logMock

        beforeEach(() => {
            logMock = jest.fn()

            global.console.log = logMock
        })
        
        // no replacement if new chain is not longer
        describe("when the new chain is not longer", () => {

            beforeEach(() => {
                // modify new Chain slightly
                newChain.chain[0] = {new: 'chain'}

                // even after calling replace chain the chain will not be replaced
                blockchain.replaceChain(newChain.chain)
            })

            it("does not replace the chain", () => {
                expect(blockchain.chain).toEqual(originalChain)
            })

            // check to see if error has been logged
            it("logs an error", () => {
                expect(errorMock).toHaveBeenCalled()
            })
        })

        // when chain is longer
        describe("when chain is longer", () => {

            // add multiple blocks for each new instance of the blockchain
            beforeEach(() => {
                // add blocks
                newChain.addBlock({data: "Bears"})
                newChain.addBlock({data: "Beets"})
                newChain.addBlock({data: "Battlestar Galactica"})
            })

            // invalid chain
            describe("and the chain is invalid", () => {

                beforeEach(() => {
                    // make the block invalid
                    newChain.chain[2].hash = "fake-hash"
                    blockchain.replaceChain(newChain.chain)
                })

                it("does not replace the chain", () => {

                    expect(blockchain.chain).toEqual(originalChain)
                })

                 // check to see if error has been logged
                it("logs an error", () => {
                    expect(errorMock).toHaveBeenCalled()
                })
            })

            // valid chain
            describe("and the chain is valid", () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain)
                })

                it("does replace the chain", () => {
                    
                    expect(blockchain.chain).toEqual(newChain.chain)
                })

                it("logs about the chain replacement", () => {
                    expect(logMock).toHaveBeenCalled()
                })
            })

        })

    })

    // validate validateTransactions flag
    describe('and the `validateTransactions` flag is true', () => {
        it("calls validTransactionData()", () => {
            // stub the calling of the method
            const validTransactionDataMock = jest.fn()

            blockchain.validTransactionData = validTransactionDataMock

            // need to add a block so the new chain has the chance to be longer than the local chain
            // so that it has a chance of being replaced
            newChain.addBlock({ date: "anything-data" })

            // replace the chain and pass the flag as true and expect the method to be called
            blockchain.replaceChain(newChain.chain, true)

            expect(validTransactionDataMock).toHaveBeenCalled()
        })
    })

    // Validate transactions
    describe("validTransactionData()", () => {
        // initial transactions and wallet
        let transaction, rewardTransaction, wallet

        // initialize the variables before each test
        beforeEach(() => {
            wallet = new Wallet(), 
            transaction = wallet.createTransaction({ recipient: "example-wallet", amount: 65})
            rewardTransaction = Transaction.rewardTransaction({ minerWallet: wallet })
        })

        // Case 1) Transaction data is valid
        describe("and the transaction data is valid", () => {
            it("returns true", () => {
                // add block to a new chain as we want a main chain instace to check
                // that another chain from a separate instance is valid according
                // to its transactional data 
                newChain.addBlock({ data: [transaction, rewardTransaction] })

                // validate the new chain transaction data using the local one
                // it is based on our own blockchain history so it is not static
                expect(
                    blockchain.validTransactionData({ chain: newChain.chain })
                ).toBe(true)

                expect(errorMock).not.toHaveBeenCalled()
            })
        })

        // Case 2) Transaction data is invalid
        // 1 Only one reward
        describe('and the transaction data has multiple rewards', () => { 
            it("returns false and logs and error", () => {
                newChain.addBlock({
                    data: [transaction, rewardTransaction, rewardTransaction]
                })

                expect(blockchain.validTransactionData({ chain: newChain.chain }))
                    .toBe(false)

                expect(errorMock).toHaveBeenCalled()
            })
         })

         // 2 transaction data should be valid when it comes to its outputs
         // no malformed outputMaps -> no werid values/try to give recipients too much/little
         describe('and the transaction data has at least one malformed outputMap', () => {
            
            // case a) Not reward transaction
             describe('and the transction is not a reward transaction', () => { 
                it("returns false and logs and error", () => {
                    transaction.outputMap[wallet.publicKey] = 999999

                    newChain.addBlock({ data: [transaction, rewardTransaction]})

                    expect(blockchain.validTransactionData({ chain: newChain.chain }))
                    .toBe(false)

                    expect(errorMock).toHaveBeenCalled()
                })
              })

             // case b) Is reward transaction
             describe('and the transction is a reward transaction', () => { 
                it("returns false and logs and error", () => {
                    rewardTransaction.outputMap[wallet.publicKey] = 999999

                    newChain.addBlock({ data: [transaction, rewardTransaction]})

                    expect(blockchain.validTransactionData({ chain: newChain.chain }))
                    .toBe(false)

                    expect(errorMock).toHaveBeenCalled()
                })
              })
            })

         // 3 valid input balances according to history - no malformed inputs
         describe('and the transaction data has at least one malformed input', () => { 
            it("returns false and logs and error", () => {
                // create malformed input
                wallet.balance = 9000

                const evilOutputMap = {
                    [wallet.publicKey]: 8900, // amount dedicated to the public key
                    exampleRecipient: 100
                }

                const evilTransaction = {
                    input: {
                        // consist of fake values - used by any attacker
                        timestamp: Date.now(),
                        amount: wallet.balance, 
                        address: wallet.publicKey,
                        signature: wallet.sign(evilOutputMap)
                    },
                    outputMap: evilOutputMap
                }

                // add the attacker block
                newChain.addBlock({ data: [evilTransaction, rewardTransaction]})

                expect(blockchain.validTransactionData({ chain: newChain.chain }))
                    .toBe(false)

                expect(errorMock).toHaveBeenCalled()
            })
          })

         // 4 unique set of block transactions
         describe("and a block contains multiple indentical transactions", () => {
            it("returns false and logs and error", () => {
                // add block to chain with duplicate transactions
                newChain.addBlock({
                    data: [transaction, transaction, transaction, transaction, rewardTransaction]
                })

                expect(blockchain.validTransactionData({ chain: newChain.chain }))
                 .toBe(false)
                
                expect(errorMock).toHaveBeenCalled()
            })
         })
    })
})