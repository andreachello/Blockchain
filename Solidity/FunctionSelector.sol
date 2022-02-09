// SPDX-License-Identifier: MIT
pragma solidity 0.8;

/* 

When a function is called, the first 4 bytes of calldata specifies 
which function to call.

This 4 bytes is called a function selector.

Take for example, this code below:

It uses call to execute transfer on a contract at the address addr.

addr.call(abi.encodeWithSignature(
    "transfer(address,uint256)", 0xSomeAddress, 123)
    )

The first 4 bytes returned from abi.encodeWithSignature(....) 
is the function selector.

*/

contract Receiver {

    // logging the data being sent
    event Log(bytes data);

    function transfer(address _to, uint amount) external {
        emit Log(msg.data);
        /*
        "transfer(address,uint256)"
        msg.data: 
        0xa9059cbb0000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc4000000000000000000000000000000000000000000000000000000000000006f
        */
    }

    /*
    How does the msg.data encode the function to call and the 
    parameters to pass to the function?

    1. The first 4 bytes encodes the function to call: 
        function selector --> 0xa9059cbb

    2. The rest of the data are the function params to pass to the function: 
        address --> 0000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc
        amount  --> 4000000000000000000000000000000000000000000000000000000000000006f

        The data is encoded in hexadecimal so if we decode it, it will turn
        out to be the input being passed (111 in this case)

    We get the function selector data by taking the string of the function
    signature, taking the hash, and then taking the first 4 bytes of the hash
    */

}

contract FunctionSelector {

    // pass in a function signature (calldata)
    // call by using "transfer(address,uint256)"
    // check that the data is equal to the above function signiture
    function getSelector(string calldata _func) external pure returns (bytes4) {
        // first 4 bytes of the hash of the function (casting the string as bytes)
        return bytes4(keccak256(bytes(_func)));
    }
}
