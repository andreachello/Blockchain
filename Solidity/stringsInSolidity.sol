pragma solidity >= 0.7.0 < 0.9.0;

contract stringsInSolidity {
    
    string greetings = "Hello";
    
    // strings have to be saved to memory (like RAM which will be erased at each function call)
    function sayHello() public view returns(string memory) {
        return greetings;
    }
    
    function changeGreeting(string memory _change) public {
        greetings = _change;
    }
    
    // Need to convert the string into bytes in Solidity in order to get the length of the string literal
    function getChar() public view returns(uint) {
        // convert strings to bytes
        bytes memory stringToBytes = bytes(greetings);
        return stringToBytes.length;
    }
}
