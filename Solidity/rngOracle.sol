pragma solidity >= 0.7.0 < 0.9.0;

/*

Blockchain oracles are third-party services that provide smart contracts with external information. 
They serve as bridges between blockchains and the outside world.

Oracle dynamic feeds are the dynamically changing outside data that we feed into our smart contracts.

*/

// Here we want to build an Oracle such that the random number generator is less subject to
// miner manipulation, given miners already know information like the block number etc.

contract Oracle {
    address admin;
    uint public rand;
    
    constructor() public {
        admin = msg.sender;
    }
    
    function setInteger(uint _int) external {
        require(admin == msg.sender);
        rand = _int;
    }
}

// Address input has to be the address of the Oracle

contract RandomNumberGenerator {
    
    Oracle oracle;
    
    constructor(address oracleAddress) {
        oracle = Oracle(oracleAddress);
    }
    
    /*
    Build a random number generator that takes an input range and uses cryptographic hashing
    */
    
    function randMod(uint range) external view returns(uint) {
        // grab information from the blockchain to randomly generate random numbers
        // grab from the abi encodePacked which concatenates arguments (sums up)
        // which will be timestamp of block, difficulty and the msg.sender
        
        return uint(keccak256(
                        abi.encodePacked(
                            block.timestamp,
                            block.difficulty,
                            msg.sender,
                            oracle.rand
                            )
                        )
                    ) % range;
    }
    
}
