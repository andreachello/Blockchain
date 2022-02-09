//SPDX-Licence-Identifier: MIT

pragma solidity 0.8;

/*

Pattern 2. Proxy Contract: EIP-897 ERC Delegate Proxy

Keep the address and potentially either keep storage or lose storage 

*/

/* 
How to Deploy:

- 1. Deploy the Example Logic Smart Contract

- 2. Deploy the Dispatcher at the Example Contract Address

- 3. Deploy the Example Logic Smart Contract again at the Dispatcher's address (Proxy)

- 4. Make an update to the Example Logic Smart Contract

- 5. Deploy V2 of the Example Smart Contract

- 6. call the replace function in the Dispatcher Contract with input being 
     the new contract address for V2

- 7. The old (V1) contract will be upgraded and you can test out the new
     functionality

*/

/*
Downside: 
All upgradeable Smart Contracts have to extend Upgradeable for this to work.
*/

abstract contract Upgradeable {
    mapping(bytes4 => uint32) _sizes;
    address _dest;

    function initialize() virtual public;

    function replace(address target) public {
        _dest = target;
        target.delegatecall(abi.encodeWithSelector(bytes4(keccak256("initialize()"))));
    }
}

contract Dispatcher is Upgradeable {
    
    constructor (address target) {
        replace(target);
    }

    function initialize() override public pure {
        // should only be called on target contracts, not on the dispatcher
        assert(false);
    }

    fallback() external {
        bytes4 sig;
        /*
        calldataload is the EVM opcode for getting 32 bytes from calldata:
        
        - loads 32 bytes of the transaction data onto the stack.

        The parameter to calldataload is an offset: 

        - typically the first 4 bytes of calldata is a function selector, 
        so calldataload(4) is used to get the 32 bytes starting from the 
        fifth byte

        - calldataload(0) will get the first 4 bytes i.e. the function selector
        */

        assembly { sig := calldataload(0) } // load the first 4 bytes
        uint len = _sizes[sig];
        address target = _dest;

        /*
        - calldatacopy: copies a number of bytes of the transaction data to memory.
        - calldatasize: tells the size of the transaction data.

        calldatacopy takes 3 parameters (s, f, t):

        it will
        - copy s bytes of calldata 
        - at position f 
        - into memory at position t

        */
        assembly {
            // return _dest.delegatecall(msg.data)
            // 0x0 is address(0)
            calldatacopy(0x0, 0x0, calldatasize()) // copies a number of bytes of the transaction data to memory.
            
            /*
            A delegatecall is taking the logic that is running on a target address
            and executes in the scope of the contract it calls it 
            */
            let result := delegatecall(sub(gas(), 10000), target, 0x0, calldatasize(), 0, len)        
            return(0, len) // we throu away any return data
        }
    }
}

// Logic Smart Contract

contract Example is Upgradeable {
    uint _value;

    function initialize() override public {
        _sizes[bytes4(keccak256("getUint()"))] = 32;
    }

    function getUint() public view returns (uint) {
        return _value;
    }

    function setUint(uint value) public {
        _value = value;
    }
}
