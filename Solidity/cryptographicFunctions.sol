pragma solidity >= 0.7.0 < 0.9.0;

/*

Cryptographic Hash Functions (CHF)

are mathematical algorithms that map data of aribtrary size (called the message)
to a bit array of a fixed size (the "hash value" or "hash").

It is a one-way function i.e. it is generally impossible to invert or reverse the computation

(more on this here: https://medium.com/the-quant-journey/cryptography-and-the-motivation-behind-blockchain-6edded49b4ae)


Solidity provides inbuilt cryptographic functions:

- keccak256 (bytes memory) returns (bytes32) - computes the Keccak-256 hash of th input

- sha256 (bytes memory) returns (bytes32) - computes the SHA-256 hash of the input

- ripemd160 (bytes memory) returns (bytes20) - computes the RIPEMD-160 hash of the input

Keccak is a leading hashing functions and is a family of cryptpgraphic sponge functions
designed as an alternative to SHA-256


*/

// Requirements for RNG 

// 1. modulo (%) - by computing against the remainder we can product a pseudo-random
// number within a range
// 2. cryptpgraphic hashing

contract RandomNumberGenerator {
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
                            msg.sender
                            )
                        )
                    ) % range;
    }
    
}
