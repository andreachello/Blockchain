// SPDX-License-Identifier: MIT
pragma solidity 0.8;

/*
The Fallback function is what is causing a lot of security issues in smart contracts
if not addressed correctly. It is how the DAO hack has been performed, and most hacks
have come from some errors in the fallback function.
Problems with the Fallback Function causes a Re-entrancy attack:
- Preventing issues is done by limiting what the fallback function can do
Fallback function:
- is an anonymous function that is called automatically when a contract gets a transfer 
Re-Entrancy Attack 
- When the contract with the fallback function, upon receiving a transfer from another contract's withdrawal function, 
  will recursively call the function from the other contract, from its fallback function, effectively draining the 
  other contract - Re entering the function over and over again
*/

// UNSAFE Contract 

contract UnsafeContract {
    mapping(address => uint) balance;

    function withdrawal() public {
        require(balance[msg.sender] >= 0); // Checks
        payable(msg.sender).transfer(balance[msg.sender]); // Interaction
        // setting balance to zero does not get called in a re-entracy attack
        // meaning that the fallback function will skip setting the balance to zero and will
        // call withdrawal starting from the top line of code in the function again and again
        // the balance will never be equal to zero until the contract is fully drained
        balance[msg.sender] = 0; // Effects
    }
}

// Generic Attacker Contract Code
contract Attacker {
    function start() public {
        // deposit funds to the unsafe contract
        // call to withdraw();
    }

    // Calls with no data + value: Fallback without any calldata
    receive() external payable {
        // new call to withdraw
    }
    
    // when no other function matches
    fallback() external payable {
      // if there are no methods attached to the contract
      // payable to receive value
}

// Checks, Effects, Interactions Pattern to ALWAYS use 
/*
- Checks - are the require statements
- Effects - changing the state of the contract
- Interactions - Interact with other contracts
The above contract violates this pattern as it goes - Checks, Interactions, Effects instead 
*/

contract SafeContract {
    mapping(address => uint) balance;

    function withdrawal() public {
        require(balance[msg.sender] >= 0); // Checks
        // set a temporary variable to store the current balance before resetting it
        uint toTransfer = balance[msg.sender];
        balance[msg.sender] = 0; // Effects

        // check if the transfer has occurred, if not revert the balance to the temporary value
        bool success = payable(msg.sender).send(toTransfer); // Interaction
        if (!success) {
            balance[msg.sender] = toTransfer;
        }  
    }
}

/*
Reentrancy Guard Modifier
To prevent a reentrancy attack in a Solidity smart contract, you should:
Ensure all state changes happen before calling external contracts, i.e., 
update balances or code internally before calling external code
Use function modifiers that prevent reentrancy
*/

contract ReEntrancyGuard {
    bool internal locked;

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }
}

/*
Gas Stipend and the EIP 1884:
Send and transfer function have been introduced after the DAO attack using a maximum
of 2300 gas stipend meaning that a fallback function does not have the unlimited gas that 
the msg.sender.call.value(amount) has - so as to mitigate the risk of a re-entrancy attack
--------------------------------------------------------------------------------------------------------------------------
 EIP 1884
--------------------------------------------------------------------------------------------------------------------------
- Simple Summary
This EIP proposes repricing certain opcodes, to obtain a good balance between gas expenditure and resource consumption.
- Abstract
The growth of the Ethereum state has caused certain opcodes to be more resource-intensive at this point 
than they were previously. This EIP proposes to raise the gasCost for those opcodes.
- Motivation
An imbalance between the price of an operation and the resource consumption (CPU time, memory etc) has several drawbacks:
- It could be used for attacks, by filling blocks with underpriced operations which causes excessive block processing time.
Underpriced opcodes cause a skewed block gas limit, where sometimes blocks finish quickly but other blocks with similar 
gas use finish slowly.
- If operations are well-balanced, we can maximise the block gaslimit and have a more stable processing time.
source: https://eips.ethereum.org/EIPS/eip-1884
--------------------------------------------------------------------------------------------------------------------------
This change has raised the gas cost for certain resource intesive procedures
to reduce the risk of a re-entrancy attack, however, 
future changes may still occur, meaning that the best way to future-proof one-self from these attacks
is to use the Check-Effects-Interactions Pattern instead - Re-entrancy guard Modifier as well.
Using a Call function with the pattern is a future-proof way to prevent such attacks.
*/

contract SafeContractFutureProof {
    mapping(address => uint) balance;

    function withdrawal() public {
        require(balance[msg.sender] >= 0); // Checks
        // set a temporary variable to store the current balance before resetting it
        uint toTransfer = balance[msg.sender];
        balance[msg.sender] = 0; // Effects

        // check if the transfer has occurred, if not revert the balance to the temporary value
        (bool success, ) = payable(msg.sender).call{value: toTransfer}(""); // Interaction
        if (!success) {
            balance[msg.sender] = toTransfer;
        }  
    }
}
