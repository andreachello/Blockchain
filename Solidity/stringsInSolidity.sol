pragma solidity >= 0.7.0 < 0.9.0;

contract stringsInSolidity {
    
    string greetings = "Hello";
    
    function sayHello() public view returns(string memory) {
        return greetings;
    }
    
    function changeGreeting(string memory _change) public {
        greetings = _change;
    }
    
    function getChar() public view returns(uint) {
        // convert strings to bytes
        bytes memory stringToBytes = bytes(greetings);
        return stringToBytes.length;
    }
}
