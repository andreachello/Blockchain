# Edge & Node - Smart Contract Challenge (#4)

## A. Deployment and Testing:

- Deployed on the Kovan Ethereum Testnet with contract address: `0xc10C0cFA04d6c92AcE4CeE7D82B08f15AD9219F6`
- Verified (https://kovan.etherscan.io/address/0xc10c0cfa04d6c92ace4cee7d82b08f15ad9219f6#code)
- All tests are included in the test folder as a script

## B. Write a spec and proposal about the feature:

### 1. GIP-Challenge-0001: ETHPool staking using Ether

Full link:

[GIP-Challenge-0001: ETHPool staking using Ether](./ImprovementProposal-0001/README.md)

### Motivation

Blockchain applications are widely implemented using incentive mechanisms in order to reward users of these platforms. In order to faciliate the growth of a Blockchain application, and its wide spread adoption, it is imperative therefore to implement such designs. One such design is in ther realm of *Decentralized Finance (DeFi)* and has to do with users staking a portion of their cryptocurrency in order to obtain rewards, either in the from of the same cryptocurrency or in the form of others (tokens). The need to create such a mechanism also makes it such that there are measures put in place to safeguard the interests of the stakers and the Blockchain application. This means having a robust and sound design scheme that prevents greedy behaviours.

### Implementation

We will have a deposit functionality, using the receive function, a deposit rewards functionality that takes into account the proportion of each staker's balance in relation to the total balance staked in the pool and redistributes it to all stakers currently staking in the pool - meaning that if another staker enters after this function is called they will not be entitled to recieve the rewards. Finally we will have a withdraw function where users can unstake their balance only if greater than zero and receive their rewards if they are entitled to them.

### 2. GIP-Challenge-0002: Improving the reward system by updating rewards based on time:

This is an improvement proposal to further improve upon the ETHPool smart contract.

Full link:

[GIP-Challenge-0002: Improving the reward system by updating rewards based on time](./ImprovementProposal-0002/README.md)

### Motivation

The way the current staking rewards are structured within the ETHPool smart contract is done in a static manner, i.e. the rewards are time-independent. This means that the rewards are currently solely based on the amount being staked, and the proportion of the individual stake relative to the total staked amount. This might pose some drawbacks in terms of incentives, as most protocols have compounding interest on their rewards (one of the most notable is Synthetix, from which I will be getting the mathematical model from and a simplified version of their code to further illustrate the matter).

### Implementation

The way this would be implemented would be by letting the rewards accrue with the passage of time, which we can get through `block.timestamp` in Solidity, and update the rewards accordingly.

### Changes

- Add time-based accrual of rewards
- Convert the static reward system to a more dynamic reward system
- Assume constant deposits for each staker
- Implement a modifier to update the rewards according to time
