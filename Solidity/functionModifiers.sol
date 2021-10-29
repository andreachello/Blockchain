pragma solidity >= 0.7.0 < 0.9.0;

/*

Function modifiers are used to modify the behaviour of a function.

for example to restrict use or add a prerequisite to a function.

*/
contract Owner {
    
    address owner;
    
    // When contract is deployed, the address will be set to the msg.sender
    constructor() public {
        owner = msg.sender;
    }
    
    // Function Modifier - require throws an error if it is not true
    
    modifier onlyOwner {
        require(owner == msg.sender);
        _; // if it is true then continue with the function
    }
    
    modifier checkBalance(uint price) {
        // msg.value is the amount in wei being sent with a message to a contract
        require(msg.value >= price);
        _;
    }
    
    
}

contract Register is Owner {
    
    mapping (address => bool) registeredAddresses;
    uint price;

    constructor(uint initialPrice) public {
        price = initialPrice;
    }
    
    function register() public payable checkBalance(price) {
        registeredAddresses[msg.sender] = true;
    }
    
    // Function callable under modifier conditions
    function changePrice (uint _price) public onlyOwner {
        price = _price;
    }
}
