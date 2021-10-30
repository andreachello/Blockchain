pragma solidity >= 0.7.0 < 0.9.0;

/*

The Withdrawal Pattern

(Instead of using transfer which reverts the code we can use send which returns a boolean.)

By making our transaction one at a time we greatly reduce the danger to our execution

It is not safe to interact with more than one customer at a time 

*/

function withdrawFunds(uint amount) public returns(bool success) {
    require(balanceOf[msg.sender] >= amount); // guards upfront
    balanceOf[msg.sender]  -= amount; // optimistic accounting
    msg.sender.transfer(amount); // transfer
    return true;
}
