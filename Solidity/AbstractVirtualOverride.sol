//SPDX-Licence-Identifier: MIT
pragma solidity 0.8;

/*

Abstract Contracts:

- An Abstract Contract is one which contains at least one function without 
any implementation. Such a contract is used as a base contract.

- Generally an abstract contract contains both implemented as well as abstract
functions.

- Derived contracts will implement the abstract function and use the existing
functions as and when required.

BASE --> Derived (inherits)
*/

// keywork abstract or use curly braces - BASE Contract
contract X {

    // since the function has no implementation we should mark it as virtual
    function y() public view virtual returns(string memory) {}
}

// Derived Contract
contract Z is X {
    // overriding the y function it is inheriting
    function y() public override view returns(string memory) {
        return "Hello";
    }
}

// BASE Contract

// The contract is still abstract since it has at least one function
// without implementation (without a body)

abstract contract Member {
    string name;
    uint age = 40;

    // Since the function name has no body the function is abstract
    function setName() public virtual returns(string memory);

    function getAge() public view returns(uint) {
        return age;
    }
}

// DERIVED contract

contract Teacher is Member {
    // override the function name
    function setName() public view override returns(string memory) {
        return "Pete";
    }
}

// Challenge
contract Calculator {
    function add(uint a, uint b) public virtual returns (uint) {}
}
// derived contracted - Test - is Calculator and can calculate addition
// and return the result
contract Test is Calculator {
    function add(uint a, uint b) public view override returns(uint) {
        return a + b;
    }
}
