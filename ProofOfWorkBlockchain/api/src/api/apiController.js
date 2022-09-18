const apiService = require("./apiService")

const getBlocks = (req, res) => {
    apiService.getBlocks((err, data) => {
        if (err) {
            res.status(400).send({message: err})
        } else {
            res.status(200).json(data)
        } 
    })
}

const mineBlock = (req, res) => {
    // get the data to add block
    const { data } = req.body

    apiService.mineBlock(data, (err, result) => {
        if (err) {
            res.status(400).send({message: err})
        } else {
            // redirect to the get request
            res.status(200).redirect("/api/blocks")
        }
    })
}

const transact = (req, res) => {

    const { amount, recipient } = req.body

    try {
        apiService.transact(amount, recipient, (err, result) => {
            if (err) {
                res.status(500)
            } else {               
                res.status(200).json({ type:"success", result })
            }
        })
    } catch (error) {
        return res.status(400).send({type:"error", message: error.message})
    }
}

const getTransactionPoolMap = (req, res) => {
    apiService.getTransactionPoolMap((err, result) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.json(result)
        }
    })
}

const mineTransactions = (req, res) => {
    apiService.mineTransactions((err, result) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.redirect("/api/blocks")
        }
    })
} 

const getWalletInfo = (req, res) => {
    apiService.getWalletInfo((err, result) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.json(result)
        }
    })
}

const getChainLength = (req, res) => {
    apiService.getChainLength((err, result) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.json(result)
        }
    })
}

const getBlock = (req, res) => {
    const { id } = req.params
    apiService.getBlock(id, (err, result) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.json(result)
        }
    })
}

module.exports = {
    getBlocks,
    mineBlock,
    transact,
    getTransactionPoolMap,
    mineTransactions,
    getWalletInfo,
    getChainLength,
    getBlock
}