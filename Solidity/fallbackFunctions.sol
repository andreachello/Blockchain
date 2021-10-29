pragma solidity >= 0.7.0 < 0.9.0;

/*

Fallback Functions:

 - cannot have a name - anonymous function
 
 - do not take any inputs
 
 - do not return any output
 
 - must be declared as external
 
 We use them when we call functions that do not exist, or send ether to a contract
 by send, transfer or call.
 
*send and transfer method receives 2300 amount of gas but call method receives more (all of it)

*/

contract FallBack {
    
    // create event to log outputs
    event Log(uint gas);
    
    // function will fail if it uses too much gas so it is nor recommended to write alot of code
    fallback() external payable {
    
        // Invoking the send and transfer method: we get 2300 gas which is enough to emit a Log
        // Invoking the call method: we get all the gas
        
        // use function gasleft to return how much gas is left
        emit Log(gasleft());
        
    }
    
    // get the balance
    
    function getBalance() public view returns(uint) {
        
        // return the stored balance of the contract
        
        /*
            address(this).balance is used to get the balance of an address on-chain
        */
        
        return address(this).balance;
    }
}

// New Contract will send ether to Fallback contract which will trigger fallback functions
// We will deploy the first contract and use the address of this first contract in our second
// contract in order to look at how fallback functions work and how the transfer and call 
// methods differ

contract SendToFallBack {
    // transfer ether with transfer method
    function transferToFallBack(address payable _to) public payable {
        // we automatically transfer 2300 gas amount and we transfer the value from the msg
        _to.transfer(msg.value);
    }
    
    // transfer ether with call method
    function callFallBack(address payable _to) public payable {
        // boolean to check the sent value and require to see if it is true else 
        // it will not go through
        // the value is set as an object
        (bool sent, ) = _to.call{value:msg.value}("");
        require(sent, "Failed to send");
    }
}
