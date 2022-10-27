# Synthetix Staking Reward

# 1. IERC20 Interface

In order to have a functioning staking contract we will need the IERC20 interface for:
- The staking token
- The reward token

Sets the interface for the `ERC20` functions needed to be called
```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

interface IERC20 {
	// state variables and data structures
	function totalSupply() external view returns(uint);
	function balanceOf(address account) external view returns(uint);
	
	// functions
	function transfer(address recipient, uint amount) external returns(bool);
	function allowance(address owner, address spender) external view returns(uint);
	function approve(address spender, uint amount) external returns(bool);
	function transferFrom(address sender, address recipient, uint amount) external returns(bool);
	
	// events
	event Transfer(address indexed from, address indexed to, uint amount);
	event Approval(address indexed owner, address indexed spender, uint amount);
}
```


# 2. State Variables and Constructor

## 2.1 State Variables

**a. Tokens**

- Staking Token
- Rewards Token

```solidity
// staking and rewards token
IERC20 public immutable stakingToken;
IERC20 public immutable rewardsToken;
```

**b. Owner**

```solidity
address public owner;
```

**c. Time Variables**

- `Duration` is the time interval set by the owner of the rewards schedule
- `finishAt` is the time at which the current duration expires
- `updatedAt` is the time at which the rewards are updated
```solidity
uint public duration;
uint public finishAt;
uint public updatedAt;
```

**d. Reward Variables**

- **R** =>   `rewardRate` is R, i.e. Reward per second $\frac{\text{total rewards}}{\text{duration}}$
- **First sum** => `rewardPerTokenStored` is the FIRST summation 
- **Second Sum** => `userRewardPerTokenPaid` is the LAST summation (how much the user has been paid)
- **T** => `totalSupply` T
- **S** => `balanceOf` is the staking balance of each user, S
- **r** => `rewards` tracks the rewards, r, earned by users (how much rewards each address has to claim)

$$
r = S \Bigg( \sum_{i=0}^{n-1} \frac{R}{T_i} - \sum_{i=0}^{k-1} \frac{R}{T_i} \Bigg)
$$

```solidity
uint public rewardRate; // R
uint public rewardPerTokenStored; // First Sum
uint public totalSupply; // T

mapping(address => uint) public userRewardPerTokenPaid; // Second Sum
mapping(address => uint) public balanceOf; // S
mapping(address => uint) public rewards; // r
```

## 2.2 Ownable Modifier

```solidity
modifier onlyOwner {
	require(msg.sender == owner);
	_;
}
```

## 2.3 Constructor

The constructor takes two `IERC20` tokens as inputs:
- Staking Token
- Rewards Token

```solidity
constructor(address _stakingToken, address _rewardsToken) {
	owner = msg.sender;

	// type cast the address of the tokens to IERC20
	stakingToken = IERC20(_stakingToken);
	rewardsToken = IERC20(_rewardsToken);
}
```

# 3. Update Rewards Modifier

In order to set up this modifier, that will update the rewards for the inputted user each time an action - stake, withdraw, etc. - has been executed, we will need to declare a couple of functions first


## 3.1 Min Function

This is a standard $min$ function that we need to implement for future functions
```solidity
function _min(uint x, uint y) private pure returns(uint) {
	return x <= y ? x : y;
}
```

## 3.2 Last Time Reward is Applicable

Returns the timestamp when the reward is still applicable. It compares:
- Current Time
- Finish Time

and finds the minimum between them to show the **last time the reward is applicable** for the stakers to get rewarded

```solidity
// returns the timestamp when the reward is still applicable
function lastTimeRewardApplicable() public view returns(uint) {
	return _min(block.timestamp, finishAt);
}
```

## 3.3 Reward Per Token

is calculated using 

$$
\begin{cases}
r_0 = 0 \\
r_{j_t} = r_{j_{t-1}} + \frac{R}{T} (j_t - j_{t-1})
\end{cases}
$$
**N.B.** if $T_i$ = 0 then $\frac{R}{T_i}$ is assumed to be zero

total supply > 0, add the rewardPerTokenStored with the R * the min of current time and the end time (whichever is least, to ensure that the duration of the rewards has not expired)

This is on a continuous basis as the formula depends on **time**.

```solidity
function rewardPerToken() public view returns(uint) {
	if (totalSupply == 0) {
		return rewardPerTokenStored;
	}
	
	return
		// prev r so r(t-1)
		rewardPerTokenStored +
		// R / T
		(rewardRate *
		// j(t) - j(t-1)
		(lastTimeRewardApplicable() - updatedAt) * 1e18
		)/ totalSupply;
}
```

## 3.4 Earned

Users can look at how much they have earned since they staked in the contract.

This is calculated using:

$$
r_t = r_{t - 1 } + S \Bigg( \sum_{i=0}^{n-1} \frac{R}{T_i} - \sum_{i=0}^{k-1} \frac{R}{T_i} \Bigg)
$$


or

`S*(rewardPerToken() - userRewardPerTokenPaid)`

**N.B.** The summation parts will be scaled up by 10^18 so we divide by such amount add the rewards previously earned by the account

```solidity
// users can look at how much they have earned
function earned(address _account) public view returns(uint) {
	return
	((balanceOf[_account] *
	(rewardPerToken() - userRewardPerTokenPaid[_account])) / 1e18)
	+ rewards[_account];
}
```

## 3.5 Update Rewards

This modifer tracks **rewardPerTokenStored** and **userRewardPerTokenPaid** of the address of account we want to update - the two summation parts 

- Update `rewardPerTokenStored` by calling the `rewardPerToken()` function
- Update the  `updatedAt` time
- If the user is not the null address:
	- Update tokens user has earned, `rewards[_account]` as of the functions we calculated
	- update the `userRewardPerTokenPaid` for the user with the current stored reward

The first sum needs to be recalculated so the second sum will be equal to it - netting zero aftter the update, as it will be recalculated when this modifier is called again, which depends on the time difference

```solidity
// track rewardPerTokenStored and userRewardPerTokenPaid
// - address of account we want to update
modifier updateReward(address _account) {
	// update rewardPerTokenStored - first sum
	rewardPerTokenStored = rewardPerToken(); // updates at the current amount
	// update the updateAt 
	updatedAt = lastTimeRewardApplicable();
	
	// update userRewardPerTokenPaid
	if (_account != address(0)) {
		// update tokens user earned - r
		rewards[_account] = earned(_account);
		
		// update userRewardPerTokenPaid for the account - second sum
		userRewardPerTokenPaid[_account] = rewardPerTokenStored;
	}
	_;
}
```

# 4. Owner sets Duration and Reward Rate

These are functions only the owner of the staking contract can call

## 4.1 Set Duration

We need to make sure that the owner does not change the `duration` before the expiration of the existing duration so we check that the current time is **greater than** the finish time

```solidity
// specify duration
function setRewardsDuration(uint _duration) external onlyOwner {
	// Make sure that the owner does not change duration before expiration
	// of existing duration
	require(finishAt < block.timestamp, "reward duration not finished yet");
	
	// set the duration
	duration = _duration;
}
```

## 4.2 Set Reward Rate

This sets the reward rate which needs to be called AFTER the duration has been set since.

We have two cases:

1. Where the reward duration has expired
2. Where the reward duration has NOT expired, not finished yet, and there are some ongoing rewards and stakers are earning the rewards - first compute amount of remaining rewards then add it to inputted amount

$$
R = \begin{cases}
\frac{\text{inputted amount}}{\text{duration}},& \text{if current time } \geq \text{end of existing duration} \\
\frac{(\text{ongoingRewardRate} \times (\text{endTime - CurrentTime})) + \text{inputAmount}}{\text{duration}} ,& \text{if duration has NOT expired}
\end{cases}
$$

The modifier update reward for address 0 since the owner is not earning on the stake

**Checks**

Need to check that there is enough reward to be paid out by checking the balance of the reward token locked inside this contract

since, 

$$
R = \frac{\text{total rewards}}{\text{duration}}
$$

we can get the total rewards and check if the amount is less than or greater than the balance of rewardsToken in the contract:

$$
\text{total rewards} = R \times \text{duration}
$$

**Updates**

Then we can update

- final expiration time of the new duration (current time + current duration)
- time when this was updated at = current time

```solidity
// set reward rate and update
// modifier update reward for address 0 since the owner is not earning on the stake
function notifyRewardAmount(uint _amount) external onlyOwner updateReward(address(0)){
	// depends whether or not current duration is expired
	if (block.timestamp >= finishAt) {
		rewardRate = _amount / duration;
	} else {
		// the reward duration hand there are some ongoing rewards
		uint remainingRewards = rewardRate * (finishAt - block.timestamp);
		// increase
		rewardRate = (remainingRewards + _amount) / duration;
	}
	
	// check that the rate is greater than zero
	require(rewardRate > 0, "reward rate is equal to zero");
	
	// check there is enough reward to be paid out by checking the balance
	// of the reward token locked inside this contract
	require(
		// get the R so multiply by duration to cancel out the rate
		rewardRate * duration <= rewardsToken.balanceOf(address(this)),
		"reward amount > balance"
	);
		
	// update timestamp - add the current time to the duration
	finishAt = block.timestamp + duration;
	
	// update updatedAt (current time)
	updatedAt = block.timestamp;
}
```

# 5. Stake, Withdraw and Get Reward

Note to fix, all three functions should be `nonReentrant`

## 5.1 Stake

A user can stake their `stakingToken` by calling this function, it wil:

- use the `transferFrom` function from the `stakingtoken` from the sender to the contract address with the amount
- increase balance of the user  by the amount
- increase total supply by the amount

Since it is an action, we need to update rewardPerTokenStored and userRewardPerTokenPaid used within the modifier

```solidity
// stake
function stake(uint _amount) external updateReward(msg.sender) {
	// amount sent > 0
	require(_amount > 0, "amount = 0");
	
	// transfer the staking tokens to the contract
	stakingToken.transferFrom(msg.sender, address(this), _amount);
	
	// update the balance of the user
	balanceOf[msg.sender] += _amount;
	
	// update total supply
	totalSupply += _amount;
}
 ```

## 5.2 Withdraw

A user can withdraw their stake 

- decrease balance of caller by amount
- decrease total supply by amount
- transfer the `stakingToken` back to the caller

Since it is an action, we need to update rewardPerTokenStored and userRewardPerTokenPaid used within the modifier
```solidity
// withdraw
function withdraw(uint _amount) external updateReward(msg.sender) {
	require(_amount > 0, "amount = 0");

	// subtract amount from user balance and total supply
	balanceOf[msg.sender] -= _amount;
	totalSupply -= _amount;

	// transfer staking tokens to user
	stakingToken.transfer(msg.sender, _amount);
}
```

## 5.3 Get Reward

The user can, at any point during the stake, claim their rewards token

- get the rewards for the caller
- check if rewards are greater than zero
- reset reward mapping for the user to zero
- transfer the rewards token to the user

```solidity
// stakers can claim rewards - recalc rewards
function getReward() external updateReward(msg.sender){
	// amount of rewards earned by user
	uint reward = rewards[msg.sender]; // up to date given the modifier
	
	// transfer if greater than zero
	if (reward > 0) {
		// reset
		rewards[msg.sender] = 0;
		rewardsToken.transfer(msg.sender, reward);
	}
}
```
