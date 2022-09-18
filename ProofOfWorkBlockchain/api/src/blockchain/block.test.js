const hexToBinary = require("hex-to-binary")
const Block = require("./block");
const { GENESIS_DATA, MINE_RATE} = require("../config");
const { cryptoHash } = require("../utils");


describe('Block', () => {
    const timestamp = 2000;
    const lastHash = "foo-hash";
    const hash = 'bar-hash';
    const data = ["blockchain", "data"];
    const nonce = 1
    const difficulty = 1
    const block = new Block({
        timestamp,
        lastHash,
        hash,
        data,
        nonce, 
        difficulty
    });

    it("has the correct constructor", () => {
        expect(block.timestamp).toEqual(timestamp)
        expect(block.lastHash).toEqual(lastHash)
        expect(block.hash).toEqual(hash)
        expect(block.data).toEqual(data)
        expect(block.nonce).toEqual(nonce)
        expect(block.difficulty).toEqual(difficulty)
    })

    describe("genesis()", () => {
        const genesisBlock = Block.genesis()

        it("returns a Block instance", () => {
            expect(genesisBlock instanceof Block).toBe(true)
        })

        it("returns the genesis data", () => {
            expect(genesisBlock).toEqual(GENESIS_DATA)
        })
    })

    describe("mineBlock()", () => {
        const lastBlock = Block.genesis()
        const data = "mined data"
        const minedBlock = Block.mineBlock({lastBlock, data})

        it("returns a Block instance", () => {
            expect(minedBlock instanceof Block).toBe(true)
        })

        it("Sets the `lastHash` to be the `hash` of the lastBlock", () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash)
        })
    
        it("sets the data", () => {
            expect(minedBlock.data).toEqual(data)
        })

        it("sets a `timestamp`", () => {
            expect(minedBlock.timestamp).not.toEqual(undefined)
        })

        it("creates a SHA-256 hash based on proper inputs", () => {
            expect(minedBlock.hash)
                .toEqual(
                    cryptoHash(
                        minedBlock.nonce,
                        minedBlock.difficulty,
                        minedBlock.timestamp,
                        lastBlock.hash,
                        data
                    )
                )
        })

        // varying difficulty given hash
        it("sets a `hash` that matches the difficulty criteria", () => {
            // check that the leading zeroes in the mined block (hash) are equal to the difficulty
            expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty))
                .toEqual("0".repeat(minedBlock.difficulty))
        })

        it("adjusts the difficulty", () => {
            // either the block is mined to quickly or too slowly
            const possibleResults = [lastBlock.difficulty + 1, lastBlock.difficulty - 1]

            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true)

        })
        
    })

    describe("adjustDifficulty()", () => {
        // difficulty doe not need to be based on a specific instance of the block so it can be static
        it("raises the difficulty for a quickly mined block", () => {
            expect(Block.adjustDifficulty({
                 originalBlock: block,
                 timestamp: block.timestamp + MINE_RATE - 100 // represents a quickly mined block (lower how quickly mined by 100 ms)
            })).toEqual(block.difficulty + 1)
        })

        it("lowers the difficulty for a slowly mined block", () => {
            expect(Block.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE + 100 // represents a slowly mined block
           })).toEqual(block.difficulty - 1)
        })

        it("has a lower limit of 1", () => {
            // the difficulty cannot be zero or negative - test for edge cases
            block.difficulty = - 1

            expect(Block.adjustDifficulty({originalBlock:block})).toEqual(1) // 1 is difficulty lower limit 
        })
    })
})