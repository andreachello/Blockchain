# GIP-Challenge-0002: Improving the reward system by updating rewards based on time

Author: Andrea Chello

## Motivation


The way the current staking rewards are structured within the ETHPool smart contract is done in a static manner, i.e. the rewards are time-independent. This means that the rewards are currently solely based on the amount being staked, and the proportion of the individual stake relative to the total staked amount. This might pose some drawbacks in terms of incentives, as most protocols have compounding interest on their rewards (one of the most notable is Synthetix, from which I will be getting the mathematical model from and a simplified version of their code to further illustrate the matter).

## Implementation

### a. Costly Approach

The way this would be implemented would be by letting the rewards accrue with the passage of time, which we can get through `block.timestamp` in Solidity, and update the rewards accordingly.

Let:

- `r(u, a, b)` be the reward for user u for a <= T <= b
- `l(u,t)` be the token staked by user u at time t
- `L(t)` be the total tokens staked in the pool 
- `R` be the rewards minted per second

<img src="./images/rewards_iteration.png"/>

This Solidity implementation, however, would lead us to use a `for` loop, which **we want to avoid in order to minimize gas fees**:

```solidity
// keeps track of the total being staked at each given time
mapping(uint => uint) public totalCurrentStakeAt;
// tracks balance at at each given time
mapping(uit => mapping(address => uint)) public stakingBalanceAt;
uint[] public timestamps;

// function to distribute rewards based on time
function getRewards() {
  uint _reward = 0;
  for (uint i = 0; i < timestamps.length; i++) {
    uint _time = timestamps[i];
    _reward += (REWARD_RATE * stakingBalanceAt[_time][msg.sender]) / totalCurrentStakeAt[_time]; 
  }
}
```

In order to avoid incurring in a for loop, we can make some further assumptions and look at a different approach.

### b. Optimized Approach

For this approach we have to make one assumption:

#### Assumption:

The staking balance of each individual staker/user will remain constant.

`l(u,t) = k` for a <= t <= b

We can then take out from the summation the balance of each individual staker, as it is assumed to be constant, and by expanding the summation we get the following:

<img src="./images/optimized_rewards.png" /> 

The Solidity implementation would be:

```solidity
// store the result of the first summation
uint public rewardPerTokenStored;

// store the result of the second summation in terms of a mapping 
mapping(address => uint) public userRewardPerTokenPaid;

function getRewards() {
  uint _reward = REWARD_RATE * stakingBalance[msg.sender] (rewardPerTokenStored - userRewardPerToken[msg.sender]);
}
```

where `rewardPerTokenStored` represents the first summation and `userRewardPerToken[msg.sender]` represents the second summation.

These stored values will be updated in a **function modifier** as follows:

```solidity
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;

        // compute amount user can claim so far and store it in rewards mapping (of the user)
        rewards[account] = earned(account);
        userRewardPerTokenPaid[account] = rewardPerTokenStored;
        _;
    }
```

## Changes

- Add time-based accrual of rewards
- Convert the static reward system to a more dynamic reward system
- Assume constant deposits for each staker
- Implement a modifier to update the rewards according to time
