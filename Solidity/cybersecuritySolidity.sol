pragma solidity >= 0.7.0 < 0.9.0;

/*

Cybersecurity in Solidity

The Withdrawal pattern:

ensures that direct transfer calls are not made, which pose a security threat.
Transfers are atomic (meaning all or nothing is executed)

*/

// If we write a function that uses the transfer method to refund all contributors 

// (dummy contract - do not run)

// contract Refund {
    
//     modifier onlyOwner{
//         true;
//         _;
//     }
    
//     uint [] funders;
//     uint contributedAmount;
    
//     function returnFunds() public onlyOwner returns(bool) {
//     for (uint i=0; funders.length; i++) {
//         funders[i].transfer(contributedAmount);
//     }
//     return true;
// }


/*
then we would face the following dilemmas:

Single Point of Failure

1. What if the owner decides not to return the funds? Then the owner becomes a single point of failure
and this pattern suggests a server-centric thinking rather than decentralized-thinking

2. The loop is unbound meaning it could run out of gas before allocating all the funds back
and an attacker could simply just make a bunch of small contributions in order to break the contract

*/

// If we have to investors only to refund:
// and we have one investor rejecting the transfer, it will make the transfer fail for the other
// making the other investor lose money.
// If it is more in their interests to reject funds then chances they will
    
    // function returnFund() public onlyOwner returns(bool) {
    //     investor_1.transfer(contributedAmount);
    //     investor_2.transfer(contributedAmount);
    //     return true;
    // }
    
// If we write a fallback function:

// fallback() public {}

// a default function is not payable as - it will reject funds
// therefore is. one contract has a default fallback function 
// it would be deadly for the naive (non-protected) contract to refund this contract aaddress
// as it will not work unless everyone accepts - it will fail.

// }

/*Vulnerable Smart Contracts*/

/*
How does a contract find out if another address is a contract?

Let us build two contracts - victim - attacker
*/

contract Victim {
    function isItAContract() public view returns(bool){
        // if there are bytes of code greater than zero then it is a contract
        uint32 size;
        address a = msg.sender;
        
        // we can access the assembly of the EVM to look at the size of the address
        assembly {
            // extcodesize retrieves the size of the code
            size:= extcodesize(a)
        }
        return (size > 0);
    }
}

// Attacker using the Malicious constructor trick

contract Attacker {
    bool public evadeDetection;
    Victim victim;
    
    // evade the identification of being a contract
    // if we call the address from the constructor there are no byte code
    // so this is a contract in disguise
    constructor(address _victim) public {
        victim = Victim(_victim);
        evadeDetection = !victim.isItAContract();
    }
    
}
