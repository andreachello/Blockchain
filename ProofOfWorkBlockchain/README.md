# Proof of Work Blockchain Architecture

## 1. Block

### 1.1 Constructor
```
constructor({
	timestamp,
	lastHash,
	hash,
	data,
	nonce,
	difficulty
})
```

The difficulty and nonce field are created for a Proof of Work system to account for how quickly new blocks can be created

### 1.2 Genesis Block (static)
Initial dummy block with initial hard coded values to start the chain

### 1.3 Mine Block (static)

We use a do while loop to compute the correct value of the hashed data using a cryptographic hash function that accepts multiple inputs, sort the inputs, stringify the inputs to track any changes to the objects and then it creates a unique hash based on that.

If any character changes a unique hash will be generated

### 1.4 Adjust Difficulty (static)

The **difficulty** adjusts and it is achieved by averaging the rate at which blocks get mined in the system to get close to s **set mine rate**

$$
\begin{cases}
\text{Raising difficulty => slow miners down} \\
\text{Lowering difficulty => speed miners up (find hashes quicker)}
\end{cases}
$$

## 2. Blockchain

### 2.1 Constructor

```
constructor() {
	this.chain = [Block.genesis()]
}
```

The hash allows us to link together blocks in a chain array with the **last hash field** of each block being set to the **previous block's hash** 

### 2.2 AddBlock

We pass in the data needed to be added in the block

### 2.3 Chain Validation

This chain validation primarily involves two checks:

**1. The last hash of each block** must be valid

**2.  Difficulty requirement** for each validated hash based off of a leading zero bits of the hash

**3. The block fields must be correct according to a validated hash**

### 2.4 Replace Chain

If the incoming chain is **longer** than the current stored chain array **and is valid** then the current blockchain array will be replaced with the new incoming array 

The overall system works on multiple nodes agreeing on the longest version of the overall blockchain - the longer the chain gets the more powerful and hard to attack the system becomes

### 2.5 Validate Transaction Data

Enforces 4 rules that the transaction data must follow in order to be considered valid:

- **1. No duplicate** miner rewards in a block
- **2. Transaction should add a valid structure** overall ensured by the `validTransaction` method in the `Transaction` class, meaning its **input signature** should be good and its **outputMap** should be formatted correctly with **an output total that matches the input amount** and **miners should have the correct mining rewards**
- **3. The input balances must be valid and correct** according to the blockchain history 
- **4. No duplicate of an identical transaction within a block**

## 3. Broadcasting
We can use any pub-sub implementation to:

- Broadcast the chain to all peer nodes
- Broadcast the addition/mining of the blocks
- Broadcast the transactions 

Subscribe to channels, BLOCKCHAIN and TRANSACTION in order to receive broadcasted data

## 4. Wallet
Allows multiple users to interact with each other in the blockchain.

**Primary function** is to hold the **key-pair** which contains a private and a public key

- **Public key** can be used as an address to receive currency on the system
- **Private key** must be kept secret

**Ability to generate unique signatures for data**

### 4.1 Constructor

We use the Elliptic Curve cryptography in order to generate the key pair
```
consructor () => {
	this.balance = STARTING_BALANCE
	this.keyPair = ec.genKeyPair()
	this.publicKey = this.keyPair.getPublic().encode("hex")
}
```

### 4.2 Calculate Balance

The balance at any point in tims is the output amount for that wallet at **its most recent transaction** in addition to any output amounts it received in the blockchain history **after the most recent transaction**

## 5. Transaction

Transactions are the official records of the exchange of currency between two wallets

### 5.1 Constructor
```
constructor({
	senderWallet,
	recipient,
	amount,
	outputMap,
	input
})
```

### 5.2 Create OutputMap

Records the balance transferred to the wallet from the sender.

It contains any values that were conducted in the transaction.

- amount to recipient
- remaining balance of the sender

### 5.3 Create Input

Generates the inputs to be fed into the transaction:

- timestamp
- amount
- address
- valid signature

### 5.4 Valid Transaction (static)

Verify that the transaction is valid:

- get a running total of the amount in the transaction - OUTPUT
- check if the INPUT amount is different than the running total OUTPUT
- check that the signature is from the correct address

## 6. Mempool

Collect data in the Mempool or transaction pool. This has an inner transaction map that can set transactions, update or replace

### 6.1 Transaction Miner
Gets the **valid** transactions from the pool and receives the reward transaction when successfull addition of the block to the chain occurs. 

The miner will broadcast the new valid chain the **clear all local transactions** which is updated and broadcasted to all nodes

## 7. Production Peer Nodes
Once we have the main application in production, in order to have multiple peer nodes we wil have to make a clone of the project and redeploy on - in this case - Heroku in order to instatiate a new peer node.

`$git remote -v`

`$git clone [origin]`

The root node address in production is going to be your production domain instance - in this case it is a Heroku instance - so if cloning the project make sure to replace it with your own.