pragma solidity >= 0.7.0 < 0.9.0;

/*

How to Structure a Coin:

- Allows only the creator to create new coins (Issuance)

- Anyone can send coins to each other without a need for registering info

*/

contract Coin {
    
    // minter
    address public minter;
    
    // balance of addresses
    mapping(address=>uint) public balances;
    
    // event handlers
    event Sent(address from, address to, uint amount);

    // upon deployment the minter is set to the msg.sender
    constructor() {
        minter = msg.sender;
    }
    
    // mint the coin:
    // - make new coins and send them to an address
    // - only the owner can send these coins
    function mint(address receiver, uint amount) public {
        require(msg.sender == minter);
        
        // send amount to the receiver contract address
        // be able to increase the supply or amount each time
        balances[receiver] += amount;
    }
    
    // error data type for solidity
    error insufficientBalance(uint requested, uint available);
    
    // send any amount of coins to an existing address
    function send(address receiver, uint amount) public {
        
        // require balance of sender to be greater or equal to amount or else revert
        
        if(amount > balances[msg.sender]){
            revert insufficientBalance({
                requested: amount,
                available: balances[msg.sender]
            });
        }
        
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        
        emit Sent(msg.sender, receiver, amount);
    }
    
}
