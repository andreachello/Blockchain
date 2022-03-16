# GIP-Challenge-0001: ETHPool staking using Ether

Author: Andrea Chello

## Motivation

Blockchain applications are widely implemented using incentive mechanisms in order to reward users of these platforms. In order to faciliate the growth of a Blockchain application, and its wide spread adoption, it is imperative therefore to implement such designs. One such design is in ther realm of Decentralized Finance (DeFi) and has to do with users staking a portion of their cryptocurrency in order to obtain rewards, either in the same cryptocurrency or in others. The need to create such a mechanism also makes it such that there are measures put in place to safeguard the interests of the stakers and the Blockchain application. This means having a robust and sound design scheme that prevents double spending and greedy behaviours.

## Implementation

We will have a deposit functionality, using the receive function, a deposit rewards functionality that takes into account the proportion of each staker's balance in relation to the total balance staked in the pool and redistributes it to all stakers currently staking in the pool - meaning that if another staker enters after this function is called they will not be entitled to recieve the rewards. Finally we will have a withdraw function where users can unstake their balance only if greater than zero and receive their rewards if they are entitled to them.

We will start by allowing users to deposit - or stake - their Ether and keep track of those user's balances and if they have staked before.

```solidity

    // current total staked balance
    uint public totalCurrentStake;

    // array of stakers
    address[] public stakers;

    // keep track of amount staked
    mapping(address => uint) public stakingBalance;
    // keep track of if investors have staked or not in the past
    // this in order to not double count stakers
    mapping(address => bool) public hasStaked;

    // Receive ETH from users assuming no message data is sent
    // We do this instead of using a fallback function
    receive() external payable {

        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        // update staking balance and logic
        stakingBalance[msg.sender] += msg.value;
        hasStaked[msg.sender] = true;

        // update total being staked
        totalCurrentStake += msg.value;

        // emit event
        emit Deposit(msg.sender, msg.value);
    }

```

We then make sure that only the Team can issue - or deposit - rewards and that only the users currently staking will be able to withdraw the rewards which will be added to their current staked balance.

Let:

- `r` be the reward for each user
- `l_i` be the token staked by each user
- `L` be the total tokens staked in the pool 
- `R` be the total rewards deposited in the pool by the team
- `n` be the total number of users currently staking in the pool

<img src="./images/rewards.png"/>

```solidity

    function depositRewards() public payable {
        require(totalCurrentStake > 0, "In order to deposit rewards there must be stakers currently in the pool");

        for (uint i = 0; i < stakers.length; i++) {

            address _staker = stakers[i];

            uint _rewards = (((stakingBalance[_staker] * 100) / totalCurrentStake) * msg.value)/100;

            stakingBalance[_staker] += _rewards;
        }
    }

```

The formula used takes the staking balance of each staker, multiplies it by 100 (to avoid issues with floating point values in Solidity) then the resulting value is divided by the total balance of stakers in the pool. This represents the proportion that the staker has staked in relation to the total amount staked. The result is then multiplied by the rewards deposited by the team and then divided by 100 (again, in order to avoid issues with floating point values in Solidity). This represents the amount of rewards each user will receive, added to their balance, in proportion to their stake.

Finally we implement a withdrawal function, or an unstake function, where the requirement is that the user must have a staking balance greater than zero:

```solidity

    function withdraw() public {
        uint _balance = stakingBalance[msg.sender];

        require(_balance > 0, "Nothing left to withdraw");

        // reset staker balance and current stake
        stakingBalance[msg.sender] = 0;

        payable(msg.sender).transfer(_balance);

        // emit event
        emit Withdraw(msg.sender, _balance);
    }

```

Unstaking will allow the stakers to withdraw their initial stake plus the rewards if they are entitled to them.
