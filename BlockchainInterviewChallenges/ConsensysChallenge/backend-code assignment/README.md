# Jupiter Custody: Technical take home challenge

## What is this?

Jupiter Custody is a rough, simple approximation of what we call might call a crypto custodian, or an ethereum signing service. We've removed a number of things, like auth, to make things simpler.

In Codefi, we use something similar to it to in our tests.

It can sign and submit ethereum transactions, like a crypto wallet, but as a service.

## How does it work?

The idea is simple - it's a web service that sits in front of MetaMask's [eth-hd-keyring](https://github.com/MetaMask/eth-hd-keyring) and talks to [Infura](https://infura.io/) as its entrypoint into Ethereum.

It's written in [Nest.js](https://nestjs.com/)

When it starts up, it uses the mnemonic defined in the environment variable to create a wallet. The addresses of these wallets are stored in a database table.

- There are account endpoints to get a list of accounts.

- There are transaction endpoints to sign transactions, get transactions and update transactions.

- When the user wants to sign a transaction, it will use the keyring to sign it.

- When the user wants to submit a transaction, it will use Infura via ethers.js.

- Once a transaction is mined, every few seconds the service will check if it is mined. Once it is, it will update the database record.

Don't worry if you're not familiar with the keyring, ethers, infura or NestJs - the code is all there. What we need you to do is complete it.

## How to get it running?

As prerequites, you need Docker, docker-compose and a recent version of Node JS (e.g v14)

First you will install the dependences

```
npm i
```

Then you will need to get the database running

```
docker-compose up
```


Finally, you can run the application with `npm start`. It should automatically create the database tables, but if it doesn't, you can run 

`./migrate.sh`

`npm run start dev` will also start the application, in hot-reload mode, so that it will restart when you make a change.

You can now visit http://localhost:3001/docs to see the API spec and make requests.

Try GET ​/custodian​/account and you'll see three ethereum accounts on the **Rinkeby** testnet. We've loaded them with some test ether for you - try not to spend it all (seriously)!

You can look at `test_endpoints.sh` for some example requests.

## The code

Even though we've stripped it down, there's still boilerplate that you can ignore. You mostly care about `src/controllers` and `src/services`.

The AccountController is the router for the account endpoints, and the TransactionController is the router for the transaction endpoints.

Each of these has a service, which works on the business logic behind these controllers.

## The challenge

The challenge has two parts

### Part one: Fix TransactionController

It looks like when we made this service, we forgot to implement any of the logic in the TransactionController! Only stubs of the endpoint methods are there. Perhaps you can put it back. Luckily, we kept the test, TransactionController.test.ts

You can run the unit tests with `npm t`. Pretty soon, you'll see what's wrong.

If it seems like a simple solution, it's probably the right one.

### Part two: Nonce management bug

This challenge is a bit trickier and a chance to be creative. You will need to complete the first challenge first.

When you sign an ethereum transaction, it gets a [nonce](https://ethereum.stackexchange.com/questions/27432/what-is-nonce-in-ethereum-how-does-it-prevent-double-spending/27450).

This is simply a number included in the signature which increase with each transaction made by each account.

For example, let's look at the [transactions](https://rinkeby.etherscan.io/address/0xb55cd6fb0d03958a7bc4916f3191985ac1154e5a) made by the test accounts we use for this challenge.

|  Hash                                                               | Nonce |
|:-------------------------------------------------------------------:|-------|
| 0xb31da81646d87c665c1147176d7f9134031179aeedaee3e82c542b7f624c9280  |   0   |
| 0xe57526275333b9c027a20b0fd91b038748e3d911b0d247a7d20ea9ef2abd022b  |   1   |
| 0xb93fe2cba2da69755e4a45bf010382ff7f28f740f4f6c81383522ad9f2c23de9  |   2   |

As you can see, the number increases by 1 each time. A transaction will be rejected by the network if it has already been used, or if it is too high.

Because the nonce starts at zero, you can get the next nonce by counting the transactions on the blockchain, as we do in the TransactionService.

```
const nonce = await this.rpcProvider.getTransactionCount(address)
```

If you have two transactions, one with nonce 1, and one with nonce 2, you must submit nonce 1 first.

Our service doesn't enforce this. Instead it always uses as a nonce the transaction count. This means if you sign two transactions, and submit the first, you cannot submit the second.

You can see this if you run the integration tests. The service must be running (npm start) first.

```
npm run test:integration
```

The test file is located at `integration/challenge.integration.test.ts`

The tests delete all the transactions they create at the end for a clean slate. You might find it helpful to disable this when debugging.

The first two tests are there for your demonstration and should pass. The third one will fail. **Your goal is to eliminate this bug.**

You're free to modify the business logic of the application, or the tests themselves, but they must pass afterwards.


Good luck!




