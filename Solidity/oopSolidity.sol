pragma solidity >= 0.7.0 < 0.9.0;

/*

OOP in Solidity

1. Constructors

constructors initialise state variables of a contract
there can be only one constructor per each contract, similar to the 
constructor in OOP
after a constructor code is executed, the final code is deployed to the blockchain

2. Inheritance

We can inherit other contracts into a contract, the same way that is done with classes

*/

contract Member {
    
    string name;
    uint age;
    
    // initialise state data upon deployment, i.e. provide inputs to the constructor
    // upon deployment
    
    constructor(string memory _name, uint _age) {
        name = _name;
        age = _age;
    }
}

// Inheritance
// We can inherit from another class/contract
// set the state variables through the Member contract

contract Teacher is Member //("Adam", 55) 
{
    constructor(string memory name_, uint age_) Member(name_, age_) public {}
    
    
    function getName() public view returns(string memory) {
        return name;
    }
    
    function getAge() public view returns(uint) {
        return age;
    }
}


//------------------------------------------------------

//                  Base and Derived

// ------------------------------------------------------

contract Base {
    
    uint data;
    
    constructor(uint _data) public {
        data = _data;
    }
    
    function getData() public view returns(uint) {
        return data;
    }
}

// in order to not make the object/contract abstract we pass in the required input

contract Derived is Base (5) {
    
    function outputNumber() public view returns(uint) {
        return data;
    }
}


