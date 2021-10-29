pragma solidity >= 0.7.0 < 0.9.0;

/*

Function Overloading:

is when we can have multiple definitions for the same function in the same scope.

The definition of the function must differ from each other by the types and/or
number of arguments in the argument list.

We cannot overload function declarations that differ only by return type.

*/

contract FunctionOverloading {
    
    // same named function but with different input types
    
    function x(bool isTrue) public {
        
    }
    
    function x(uint number) public {
        
    }
    
    // Calculations with function Overloading
    function sum(uint a, uint b) public pure returns(uint){
        return a+b;
    }
    
    function sum(uint a, uint b, uint c) public pure returns(uint) {
        return a+b+c;
    }
    
     // Calculations with function Overloading
    function sum(uint a, uint b) public pure returns(uint){
        return a+b;
    }
    
    function sum(uint a, uint b, uint c) public pure returns(uint) {
        return a+b+c;
    }
    
    // call these functions
    function getSumTwoArgs() public pure returns(uint) {
        return sum(1,2);
    }
    
    function getSumThreeArgs() public pure returns(uint) {
        return sum(1,2,3);
    }
}
