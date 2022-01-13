# Yield Staking DApp

Simplified version of a Staking platform with only one pair and manual - owner only - issuance of rewards.

![Yield_Staking_Dapp_Picture](./public/Yield_Staking_Dapp_Picture.png)

## Installation

### Setup

- **Node.js**

Install the latest version of Node.js

- **Truffle**

      Install the latest version of Truffle
      
- **Ganache** installation guide can be found in [here](https://www.trufflesuite.com/ganache).

- **MetaMask** installation guide can be found in [here](https://metamask.io/).

### Commands

- Install necessarily Node.js packages

      npm install
      
- Run Instance of Ganache - Quick Setup 

- Deploy smart contracts to the Ethereum blockchain

      truffle migrate --reset
      
- Deploy and run the front-end application

      npm start run
      
- Run the scripts to issue tokens

      truffle exec ./src/scripts/issue-tokens.js
