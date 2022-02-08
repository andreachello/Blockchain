pragma solidity 0.8;

contract TestCall {
    string public message;
    uint public x;

    event Log(string message);

    fallback() external payable{
        emit Log("fallback was called");
    }

    function foo(string memory _message, uint _x) external payable returns(bool, uint) {
        message = _message;
        x = _x;
        return(true, 999);
    }
}

contract Call {

    bytes public data;

    function callFoo(address _test) external payable {
        // need to encode the function we are calling plus inputs
        // 1. function to be calling with inputs
        // 2. value
        (bool success, bytes memory _data) = _test.call{value: 111}(abi.encodeWithSignature(
            "foo(string,uint256)", "call foo", 123));
        require(success, "failed");
        data = _data;
    } 

    // calling a function that does not exist
    function callDoesNotExist(address _test) external {
        (bool success, ) = _test.call(abi.encodeWithSignature("NoCall()"));
        require(success, "failed");
    }
}
