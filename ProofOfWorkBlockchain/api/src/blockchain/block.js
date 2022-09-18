const hexToBinary = require("hex-to-binary")
const { GENESIS_DATA, MINE_RATE } = require("../config")
const {cryptoHash} = require("../utils")

class Block {
    constructor({timestamp, lastHash, hash, data, nonce, difficulty}) {
        this.timestamp = timestamp
        this.lastHash = lastHash
        this.hash = hash
        this.data = data
        this.nonce = nonce
        this.difficulty = difficulty
    }

    // Factory method: any instance of a class that creates an instance without using the constructor method
    static genesis() {
        return new this(GENESIS_DATA)
    }

    static mineBlock({lastBlock, data}) {

        let hash, timestamp

        // const timestamp = Date.now()
        const lastHash = lastBlock.hash
        // the difficulty is based on the previous block's difficulty
        let difficulty = lastBlock.difficulty
        // nonce will be dynamic as the miner will cycle through the nonce values to mine the block
        let nonce = 0

        // computation required to mine the block until the hash with leading zeroes is found that equals to the difficulty
        do {
            // increment the nonce value on each iteration
            nonce++
            // timestamp should reflect when correct nonce is found hence updated
            timestamp = Date.now()
            // adjust the difficulty based on the last block and the current timestamp
            difficulty = Block.adjustDifficulty({originalBlock: lastBlock, timestamp})
            // create the hash - at every iteration the nonce adjusts itself
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty)
        } while (
            // binary conversion of the hex string for the difficulty check
            hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
        )
            
        return new this({
            timestamp,
            lastHash,
            data,
            difficulty,
            nonce,
            hash
        })
    }
    
    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock

        // check for invalid difficulties
        if (difficulty < 1) return 1

        // get the difference between the original timestamp of the block and the inputted timestamp
        // lower difficulty
        if (timestamp - originalBlock.timestamp > MINE_RATE) return difficulty - 1

        // increase difficulty
        return difficulty + 1
    }
}

module.exports = Block
