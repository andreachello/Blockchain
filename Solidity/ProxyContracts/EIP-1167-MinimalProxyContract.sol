// SPDX-License-Identifier: MIT
pragma solidity 0.8;

/*
Minimal Proxy Contract

Rationale:

// if you need to deploy a wallet for each user your dApp onboards. 
// Or perhaps, you need to set up an escrow for each trading operation your platform processes.
// These are examples where you’d have to deploy the same contract multiple times. 
// The initialization data is of course likely to be different for each individual contract, 
// but the code would be the same.

// Because deploying large contracts can be quite expensive, there’s a clever workaround through 
// which you can deploy the same contract thousands of times with minimal deployment costs: 
// It’s called EIP 1167, but let’s just call it Minimal Proxy.

- It is cheap to deploy a cloned contract, the constructor of the original contract is not called and the
  original contract is unaffected - because we use deletagecall

- delegatecall to execute code inside the original contract, then make any updates inside the copied contract,
this means that the copied contract doesnt need to have little to no code (minimal code rendering deployment cheap)

- The constructor is not called because the copy deploys a simple contract that forwards all call using delegatcall

BYTECODE

The exact bytecode of the standard clone contract is this: 
0x3d602d80600a3d3981f3363d3d373d3d3d363d73bebebebebebebebebebebebebebebebebebebebe5af43d82803e903d91602b57fd5bf3

    - copy runtime code into memory and return it
    0x3d602d80600a3d3981f3 this tells the EVM to return the remaining bytecode

    - code to delegatecall to address
    363d3d373d3d3d363d73 delegatecall bebe5af43d82803e903d91602b57fd5bf3 
    to address bebebebebebebebebebebebebebebebebebe

    - CREATION CODE
    is the part that calls the constructor, initial setups and then returns the runtime code
    in the minimal proxy contract there is no constructor and there is no initial setup
    0x3d602d80600a3d3981f3

    - RUNTIME CODE
    actual code executed and saved on the blockchain
    363d3d373d3d3d363d73bebebebebebebebebebebebebebebebebebebebe5af43d82803e903d91602b57fd5bf3

    - DEPLOYMENT
    For the minimal proxy contract, the actual code that is being executed is to delegate call to 
    bebebebebebebebebebebebebebebebebebe, when we deploy the contract, we need to replace this address,
    the actual address of the master copy

*/

contract MinimalProxy {
    /**
     * @dev Deploys and returns the address of a clone that mimics the behaviour of `implementation`.
     *
     * This function uses the create opcode, which should never revert.
     * The implementation is the mastercopy address and the function will programmatically replace the address
     * of the minimal proxy contract  - bebebebebebebebebebebebebebebebebebe - 
     * with the address of the implementation
     */
    function clone(address implementation) external returns (address instance) {

         // convert address to 20 bytes
        bytes20 targetBytes = bytes20(implementation);

            // create the bytecode and load it into memory
            assembly {

            /*
            get a memory address where we can store the bytecode
            reads the next 32 bytes of memory starting at pointer stored in 0x40

            In solidity, the 0x40 slot in memory is special: it contains the "free memory pointer"
            which points to the end of the currently allocated memory.
            */
            let clone := mload(0x40)
            // store 32 bytes to memory starting at "clone"
            mstore(
                clone,
                0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000
            )

            /*
              |              20 bytes                |
            0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000
                                                      ^
                                                      pointer
            */
            // store 32 bytes to memory starting at "clone" + 20 bytes
            // 0x14 = 20
            mstore(add(clone, 0x14), targetBytes)

            /*
              |               20 bytes               |                 20 bytes              |
            0x3d602d80600a3d3981f3363d3d373d3d3d363d73bebebebebebebebebebebebebebebebebebebebe
                                                                                              ^
                                                                                              pointer
            */
            // store 32 bytes to memory starting at "clone" + 40 bytes
            // 0x28 = 40
            mstore(
                add(clone, 0x28),
                0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000
            )

            /*
              |               20 bytes               |                 20 bytes              |           15 bytes          |
            0x3d602d80600a3d3981f3363d3d373d3d3d363d73bebebebebebebebebebebebebebebebebebebebe5af43d82803e903d91602b57fd5bf3
            */
            // create new contract by calling create
            // send 0 Ether
            // code starts at pointer stored in "clone"
            // code size 0x37 (55 bytes)
            instance := create(0, clone, 0x37)
        }
        require(instance != address(0), "ERC1167: create failed");
    }
}
