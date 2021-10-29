pragma solidity >= 0.7.0 < 0.9.0;

/*

There are special variables i.e global variables in Solidity and provide 
information about the blockchain:

- msg.sender: sender of the message (current function call)

- msg.value: is a uint representing the number of wei sent with the message

- block.timestamp: is the current block timestamp as seconds since unix epoch

- block.number: is a uint representing the current block number

*/

contract LedgerBalance {
    
    // create a map of wallets with amounts
    mapping(address => uint) public balance;
    
    // set up a function that can update the amount of the person calling the contract
    // i.e. current address which is msg.sender
    
    function updatesBalance(uint newBalance) public {
        balance[msg.sender] = newBalance;
    }
    
}

// Update the balance from another smart contract

 contract Updated {
     
        function updatesBalance() public {
            
            LedgerBalance ledgerbalance = new LedgerBalance();
            
            ledgerbalance.updatesBalance(30);
        }
    }
    
    
// Storage Contract - Difficulty Level of the Current Block

// How difficult it is to get a variable at the current block and time

contract SimpleStorage {
    
    uint storedData;
    
    function set(uint x) public {
        // storedData = block.difficulty;
        // storedData = block.timestamp;
        storedData = block.number;
    }
    
    function get() public view returns (uint) {
        return storedData;
    }
}
