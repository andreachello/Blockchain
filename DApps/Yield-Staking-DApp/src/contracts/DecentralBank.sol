pragma solidity ^0.5.0;

import './Reward.sol';
import './Tether.sol';

contract DecentralBank {

    /*
    Investors can:
    - deposit tokens
    - Staking tokens once deposited
    - receive rewards for their deposit

    */

    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    Reward public rwd;
    
    constructor(Reward _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    // set up array of stakers
    address [] public stakers;

    // keep track of amount staked
    mapping(address => uint) public stakingBalance;
    // keep track of if investors have staked or not
    mapping(address => bool) public hasStaked;
    // keep track if investor is staked
    mapping(address => bool) public isStaking;

    /*
    Function to Deposit token, it is going to keep track of investors staking (if they have,
    if they haven't) and be able to transfer the amount accordingly - TransferFrom as it is
    a third party transfer - trasnferred on behalf on the investors - therefore we need the
    approval functionality
     */

     function depositTokens(uint _amount) public {
         // cannot stake less than or equal to zero
         require(_amount > 0, 'amount cannot be zero or less');

         // transfer token A (Tether) to the current contract address for staking
         tether.transferFrom(msg.sender, address(this), _amount);
         
         // update staking balance
         stakingBalance[msg.sender] += _amount;

        // if the msg.sender has never staked, push the address in the staker array
         if(!hasStaked[msg.sender]) {
             stakers.push(msg.sender);
         }

         // update staking logic
         isStaking[msg.sender] = true;
         hasStaked[msg.sender] = true;

     }    

     // unstake tokens
     function unstakeTokens() public {
         uint balance = stakingBalance[msg.sender];
        require(balance > 0, 'staking balance cannot be less than zero');
        // transfer tokens back to the customer
        tether.transfer(msg.sender, balance);

        // update staking status
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
     }

     // issue rewards for staking
     function issueTokens() public {
        // create a restriction so only the owner can issue the tokens
        // require(msg.sender == owner, 'caller must be owner');

        // create incentive for stakers
        uint incentive = 9;

        // transfer the reward token to each staker
        for (uint i; i < stakers.length; i++) {
            address recepient = stakers[i];
            uint balance = stakingBalance[recepient] / incentive;
            if(balance > 0) {
                rwd.transfer(recepient, balance);
            }
        }

     }

    
}

