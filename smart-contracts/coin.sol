/*

1. Mapping is like a dictionary

* 

mapping(uint => string) phoneToName;

*

struct customer {
    unit idNum;
    string name;
    uint bidAmount;
}

mapping (address => customer) custData;

2. Message represents a call to be used to invoke a function of a smart contract

- Hold address of sender
address adr = msg.sender

- Holds value of the address
uint amt = msg.value


*/

pragma solidity ^0.4.0;

contract Coin {
    // Public makes the variables readable from outside
    address public minter;
    
    // map addresses onto balances
    mapping (address => uint) public balances;
    
    //Events allow clients to react on changes
    event Sent(address from, address to, uint amount);
    
    // constructor only run when contract is created
    function Coin() public {
        minter = msg.sender;
    }
    
    // mint coins only done by minter
    function mint (address receiver, uint amount) public {
        if (msg.sender != minter) return;
        balances[receiver] += amount;
    }
    
    function send(address receiver, uint amount) public {
        if (balances[msg.sender] < amount) return;
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        Sent(msg.sender, receiver, amount);
    }
}




