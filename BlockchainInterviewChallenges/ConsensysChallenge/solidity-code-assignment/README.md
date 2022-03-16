# Codefi technical challenge - Solidity

5 exercises with somewhat broken smart contracts, 5 suites of unit tests. The goal is to have all unit tests passing. Please only modify the smart contracts that are under the *Modifiable smart contract* section of each exercise and do not modify the unit tests code. Good luck!

## How to execute & verify

```
npm install
```

To verify, this command:

```
npm run test
```

Must return with all tests passing (or as many as possible).


## Exercise 1

`SimpleToken` is a very simple token which allows us to `mint` and to check user balances.
The problem is that gas costs are not reliable and are expensive, could we keep the costs of `mint` under `100000` gas?

Modifiable smart contract:

* `SimpleToken.sol`

Unit tests:

* `test/exercise1.test.js`

## Exercise 2

`SharesFund` was hacked by a contract called `Hacker.sol`, we are trying to prevent it from happening again and we wrote some unit tests to make sure the issue is fixed.

Modifiable smart contract:

* `SharesFund.sol`

Unit tests:

* `test/exercise2.test.js`

## Exercise 3

We have a `Vault` smart contract to store some funds. We do not want to risk too much ether inside it, so it contains some configuration to limit the amount it accepts. For some reason the `VaultFactory` does not work as expected.


Modifiable smart contract:

* `VaultFactory.sol`

Unit tests:

* `test/exercise3.test.js`

## Exercise 4

There is an already deployed smart contract but we do not know its source code (check `test/exercise4.test.js` for its bytecode). We need to store some value in its storage via `Facade.sol` smart contract but it does not seem possible...

Modifiable smart contract:

* `Facade.sol`

Unit tests:

* `test/exercise4.test.js`

## Exercise 5

We have an upgradeable oracle smart contract but we broke something. It is not possible to upgrade it anymore, what modifications do we need?

Modifiable smart contract:

* `PriceOracleV2.sol`
* `OracleProxy.sol`

Unit tests:

* `test/exercise5.test.js`
