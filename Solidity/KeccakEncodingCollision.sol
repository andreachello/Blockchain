// SPDX-License-Identifier: MIT
pragma solidity 0.8;

/*

Use cases:

- to sign a signature
- come up with a unique id
- create a contract that is protected from front running (commit review scheme)

*/

contract HashFunc {

    // the output of the keccak256 hash function is bytes32
    function hash(string memory text, uint num, address addr) external pure returns(bytes32) {
        // given that the inputs are not in bytes we need to 
        // encode the inputs into bytes
        // will return a byte which is the input of the keccak256 that will 
        // return bytes32
        return keccak256(abi.encodePacked(text, num, addr)); 

    }

    /*
    INPUT
    text: AAA
    num: 123
    addr: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4

    OUTPUT
    bytes32: 0x906353067b82d8329933a416742f83fc3047b4414a0e0353b427f9c4bc818b36
    */

    /*
    Difference between encodings:

    - abi.encode --> encodes the data into bytes
    - abi.encodePacked --> encodes the data into bytes but compresses it (output will be smaller)
    */

    function encode(string memory text0, string memory text1) external pure returns(bytes memory) {
        return abi.encode(text0, text1);
    }

    function encodePacked(string memory text0, string memory text1) external pure returns(bytes memory) {
        return abi.encodePacked(text0, text1);
    }

    /*
    
    INPUTS
    text0: AAA
    text1: BBBB

    OUTPUTS
    encode: 0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000003414141000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034242420000000000000000000000000000000000000000000000000000000000
    encodePacked: 0x414141424242

    */

    /*
    Hash Collision:

    inputs are different but it hashes to the same output:

    example:

    input1: AAAA
    input2: BBB

    is the same as

    input1: AAA
    input2: ABBB

    The output bytes32 will always be: 0x11db58448f2a53848bef361744f19e6fdabef68b8267b1ff669de1b4c42da0da
    */

    function collision(string memory text0, string memory text1) external pure returns(bytes32) {
        // passing two dynamic data types next to each other gives a hash collision
        return keccak256(abi.encodePacked(text0, text1));
    }

    /* 
    NO Collision
    
    in order to solve this we can pass another input that is not dynamic
    in between the two dynamic datatypes
    OR just use encode instead of encodePacked
    */

    function noCollision(string memory text0, uint x, string memory text1) external pure returns(bytes32) {
        // passing two dynamic data types separated by a static data type
        return keccak256(abi.encodePacked(text0, x, text1));
    }

    function noPacked(string memory text0, string memory text1) external pure returns(bytes32) {
        // passing two dynamic data types separated by a static data type
        return keccak256(abi.encode(text0, text1));
    }
}
