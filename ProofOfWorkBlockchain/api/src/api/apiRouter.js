const express = require("express")
const router = express.Router()
const apiController = require("./apiController")

// Get blockchain
router.get("/blocks", apiController.getBlocks)

// Mine/add a block in the chain
router.post("/mine", apiController.mineBlock)

// Make a new transaction
router.post("/transact", apiController.transact)

// get the transaction pool
router.get("/transaction-pool-map", apiController.getTransactionPoolMap)

// mine transactions
router.get("/mine-transactions", apiController.mineTransactions)

// get wallet information
router.get("/wallet-info", apiController.getWalletInfo)

// get length
router.get("/blocks/length", apiController.getChainLength)

// get block
router.get("/blocks/:id", apiController.getBlock)

module.exports = router