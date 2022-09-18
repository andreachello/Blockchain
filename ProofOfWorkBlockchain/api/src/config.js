// mine rate in milliseconds
const MINE_RATE = 1000

// initial difficulty
const INITIAL_DIFFICULTY = 3

// starting balance for blockchain users
const STARTING_BALANCE = 1000

// Miner reward input - distinguish regular transactions with reward transactions
const REWARD_INPUT = {
    address: "*authorized-reward*"
}

const MINING_REWARD = 50

const GENESIS_DATA = {
    timestamp: 1,
    lastHash: "----",
    hash: "hash-one",
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data:[]
}

module.exports = { GENESIS_DATA, MINE_RATE, STARTING_BALANCE, REWARD_INPUT, MINING_REWARD }