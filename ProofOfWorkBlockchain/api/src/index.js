const express = require("express")
const request = require("request")
const path = require("path")
const Blockchain = require("./blockchain")

const cors = require("cors");

const apiRouter = require("./api/apiRouter")
const TransactionPool = require("./wallet/transaction-pool");
const { seedBackend } = require("./api/apiService");

const app = express()
const blockchain = new Blockchain()
const transactionPool = new TransactionPool()


const DEFAULT_PORT = 4000
let PEER_PORT

const isDevelopment = process.env.ENV === 'development'

// dynamic ports
if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000)
}

const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT

// the address of the initial node
const ROOT_NODE_ADDRESS = isDevelopment ?
    `http://localhost:${DEFAULT_PORT}` : "https://pow-blockchain.herokuapp.com"

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

app.use(cors());
app.use("/api", apiRouter)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
})

// sync chains - when new nodes join they should sync
const syncWithRootState = () => {
    // request the root node address chain
    request({url: `${ROOT_NODE_ADDRESS}/api/blocks`}, (err, response, body) => {
        if (!err && response.statusCode === 200) {
            // get the contents of the body
            const rootChain = JSON.parse(body)

            // replace the chain with the new nodes are on with the root chain
            console.log("replace chain on a sync with", rootChain);
            blockchain.replaceChain(rootChain)
        }
    })

    // transaction pool map sync with peers
    request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map`}, (err, response, body) => {
        if (!err && response.statusCode === 200) {
            // set variable for root transaction pool map
            const rootTransactionPoolMap = JSON.parse(body)

            console.log("replace transaction pool map on a sync with", rootTransactionPoolMap);

            // call the setMap with the entire root map
            transactionPool.setMap(rootTransactionPoolMap)
            
        }
    })
}

// development test hashes
if (isDevelopment) seedBackend()

app.listen(PORT, () => {
    console.log(`Listening on localhost:${PORT}`);
    // sync root node with all nodes
    if (PORT !== DEFAULT_PORT) {
        syncWithRootState()
    }
})