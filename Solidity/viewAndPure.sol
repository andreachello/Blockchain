pragma solidity >= 0.7.0 < 0.9.0;

/*

*Pre-Built-in Modifiers

View Functions:

- ensure that the functions will not modify the state

- they return values

Pure Functions:

- ensure that they will not read nor modify the state

- return calculations

*/

contract MyContract {
    
    uint value;
    
    // does not modify the state value - i.e. is a read-only value
    function getValue() external view returns(uint) {
        // this is an eth call
        return value;
    }
    
    // returns calculations
    function getNewValue() external pure returns(uint) {
        return 5+10;
    }
    
    function multiply(uint a, uint b) external pure returns(uint) {
        return a*b;
    }
    
    // modifies the state value
    function setValue(uint _value) external {
        // this is an eth send transaction
        value = _value;
    }
    
    function valuePlusTen() public view returns(uint) {
        return value + 10;
    }
    
}
