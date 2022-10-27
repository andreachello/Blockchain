// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

// need an IERC20 in order to send the tokens to the contract
// used both for
// - staking token
// - reward token
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking {

    // staking and rewards token
    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardsToken;

    // owner, duration, reward time finish, last time contract was updated, reward rate (per second)
    address public owner;
    uint public duration;
    uint public finishAt;
    uint public updatedAt;
    uint public rewardRate;
    uint public rewardPerTokenStored;

    // store in a mapping the userRewardPerTokenPaid
    mapping(address => uint) public userRewardPerTokenPaid;
    
    // keep track of tokens user earned, r
    mapping(address => uint) public rewards;

    // track supply and amount staked per user
    uint public totalSupply;

    mapping(address => uint) public balanceOf; // S

    // MODIFIERS
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    // track rewardPerTokenStored and userRewardPerTokenPaid
    // - address of account we want to update
    modifier updateReward(address _account) {
        // update rewardPerTokenStored
        rewardPerTokenStored = rewardPerToken(); // updates at the current amount
        // update the updateAt - if duration has not expired, it will return currnet time
        // else it will return time of expiry
        updatedAt = lastTimeRewardApplicable();

        // update userRewardPerTokenPaid
        if (_account != address(0)) {
            // update tokens user earned
            rewards[_account] = earned(_account);
            // update userRewardPerTokenPaid for the account
            userRewardPerTokenPaid[_account] = rewardPerTokenStored;
        }
        _;
    }

    // CONSTRUCTOR
    constructor(address _stakingToken, address _rewardsToken) {
    owner = msg.sender;
    // type cast the address of the tokens to IERC20
    stakingToken = IERC20(_stakingToken);
    rewardsToken = IERC20(_rewardsToken);
    }
    
    // owner of the contract will be able to
    // specify duration
    function setRewardsDuration(uint _duration) external onlyOwner {
        // Make sure that the owner does not change duration before expiration
        // of existing duration
        require(finishAt < block.timestamp, "reward duration not finished yet");

        // set the duration
        duration = _duration;
    }

    // specify reward rate
    // set reward rate and update
    // modifier update reward for address 0 since the owner is not earning on the stake
    function notifyRewardAmount(uint _amount) external onlyOwner updateReward(address(0)){
        // depends whether or not current duration is expired
        if (block.timestamp >= finishAt) {
            rewardRate = _amount / duration;
        } else {
            // the reward duration is not finished yet and there are some ongoing rewards
            // and stakers are earning the rewards
            // first compute amount of remaining rewards then add it to inputted amount
            // - remaining is the rate times the difference in time between end time and current time
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

    // once this is done user can stake and withdraw
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

        // since it is an action, we need to update rewardPerTokenStored and userRewardPerTokenPaid
        // used within the modifier
    }

    // withdraw
    function withdraw(uint _amount) external updateReward(msg.sender) {
        require(_amount > 0, "amount = 0");

        // subtract amount from user balance and total supply
        balanceOf[msg.sender] -= _amount;
        totalSupply -= _amount;

        // transfer staking tokens to user
        stakingToken.transfer(msg.sender, _amount);

        // since it is an action, we need to update rewardPerTokenStored and userRewardPerTokenPaid
        // used within the modifier
    }

    // returns the timestamp when the reward is still applicable
    function lastTimeRewardApplicable() public view returns(uint) {
        return _min(block.timestamp, finishAt);
    }

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

    // users can look at how much they have earned
    function earned(address _account) public view returns(uint) {
        // S*(rewardPerToken() - userRewardPerTokenPaid)
        // the summation parts will be scaled up by 10^18 so we divide by such amount
        // add the rewards previously earned by the account
        return 
            ((balanceOf[_account] * 
            (rewardPerToken() - userRewardPerTokenPaid[_account])) / 1e18)
             + rewards[_account];
    }

    // stakers can claim rewards - recalc rewards
    function getReward() external updateReward(msg.sender){
        // amont of rewards earned by user
        uint reward = rewards[msg.sender]; // up to date given the modifier

        // transfer if greater than zero
        if (reward > 0) {
            // reset
            rewards[msg.sender] = 0;
            rewardsToken.transfer(msg.sender, reward);
        }
    }
    
    function _min(uint x, uint y) private pure returns(uint) {
        return x <= y ? x : y;
    }

}