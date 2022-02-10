// SPDX-License-Identifier: MIT
pragma solidity 0.8;

/*
Proxy Pattern 4. EIP-1822: Universal Upgradeable Proxy Standard (UUPS)

There is no need for a common Storage Smart Contract 
to let the compiler know which storage slots to use - no need to inherit.

Instead this method just simply uses a pseudo-random storage slot
to store the address of the logic contract and not let Solidity choose the 
first storage slot from the contract layout/

In assembly you can store some variable to a specific storage slot 
and then load it again from that slot. 

In this case the EIP-1822 uses the:

keccak256("PROXIABLE") = "0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7"
which results in the storage slot. 

It's not 100% random, but random enough so that there's no collision happening.

STORE:

sstore(0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7, contractLogic)

LOAD:

let contractLogic := sload(0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7)
*/

/*

How to Deploy:

- 1. Deploy MyFinalContract

- 2. Deploy Proxy with inputs:
                    Constructor Data: function signature of constructor1*
                    Contract Logic: address of MyFinalContract

    *we can get it by running:
        web3.utils.sha3('constructor1()').substring(0,10)
        equal to => 0x473be604
        which is the first 4 bytes of the fuction signature

- 3. Redeploy MyFinalContract at the Proxy address

- 4. Upgrade MyFinalContract by uncommenting the line on the increment function

- 5. Redeploy the V2 MyFinalContract passing no additional inputs

- 6. In the V1 MyFinalContract pass the new address of V2 in the updateCode function

*/

contract Proxy {
    // Code position in storage is keccak256("PROXIABLE") = "0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7"
    constructor(bytes memory constructData, address contractLogic) {
        // save the code address
        assembly { // solium-disable-line
            sstore(0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7, contractLogic)
        }
        (bool success, bytes memory result ) = contractLogic.delegatecall(constructData); // solium-disable-line
        require(success, "Construction failed");
    }

    fallback() external payable {
        assembly { // solium-disable-line
            let contractLogic := sload(0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7)
            calldatacopy(0x0, 0x0, calldatasize())
            let success := delegatecall(sub(gas(), 10000), contractLogic, 0x0, calldatasize(), 0, 0)
            let retSz := returndatasize()
            returndatacopy(0, 0, retSz)
            switch success
            case 0 {
                revert(0, retSz)
            }
            default {
                return(0, retSz)
            }
        }
    }
}

contract Proxiable {
    // Code position in storage is keccak256("PROXIABLE") = "0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7"

    function updateCodeAddress(address newAddress) internal {
        require(
            bytes32(0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7) == Proxiable(newAddress).proxiableUUID(),
            "Not compatible"
        );
        assembly { // solium-disable-line
            sstore(0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7, newAddress)
        }
    }

    function proxiableUUID() public pure returns (bytes32) {
        return 0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7;
    }
} 

// standard contract that does not do anything with proxies nor storage
// can use a ERC20 contract
contract MyContract {

    // cannot change the order of the storage variables
    address public owner;
    uint public myUint;

    function constructor1() public {
        require(owner == address(0), "Already initalized");
        owner = msg.sender;
    }

    function increment() public {
        // require(msg.sender == owner, "Only the owner can increment"); //someone forget to uncomment this
        myUint++;
    }
}

// Upgradeable Contract
contract MyFinalContract is MyContract, Proxiable {

    function updateCode(address newCode) onlyOwner public {
        updateCodeAddress(newCode);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner is allowed to perform this action");
        _;
    }
}
