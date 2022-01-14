// SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.3;

contract Mapping {
    // We can do one lookup only to find the element
    mapping(address => uint) public balances;

    // Nested mapping - represents relationships such as if an address is the friend of another address
    mapping(address => mapping(address => bool)) public isFriend;

    function examples() external {
        // set 
        balances[msg.sender] = 123;
        // get
        uint bal = balances[msg.sender];
        // get a value for a mapping we have not set yet
        uint bal2 = balances[address(1)]; // defaults to the default value of uint which is zero

        // increment balance of msg.sender
        balances[msg.sender] += 456;

        // delete mapping

        delete balances[msg.sender]; // this will delete the entry and will default it to the default uint value of zero

        // the msg.sender is a friend of this contract
        isFriend[msg.sender][address(this)] = true;
    }

}

contract IterableMapping {

    // Mapping in Solidity is not iterable unless you internally store all keys that were inserted.


    // 1. create a mapping from addresses and addressBalance
    mapping(address => uint) public balances;

    // 2. mapping that keeps track of whether a key is inserted or not
    // when we insert a new address in balances, we set the same address in the inserted mapping to true
    mapping(address => bool) public inserted;

    // 3. Keep track of all the keys that we insert into an array
    address[] public keys;

    // 4. set the balance of the mapping balances

    function set(address _key, uint _val) external {
        balances[_key] = _val;
        // keep track if key is newly inserted, if it is we need to append it to the array of keys
        // this array of keys will allow us to get all of the values stored in the balances mapping
        if(!inserted[_key]) {
            inserted[_key] = true;
            keys.push(_key);
        }
    }

    // Getting the size of the balances mapping -> given all the keys we stored are in the keys array
    // we simply need to return to length of the keys
    function getSize() external view returns(uint){
        return keys.length;
    }

    // get first and last and ith address balances in the mapping:
    function getFirst() external view returns(uint) {
        return balances[keys[0]];
    }

    function getLast() external view returns(uint) {
        return balances[keys[keys.length - 1]];
    }

    function getBalances(uint _i) external view returns(uint) {
        return balances[keys[_i]];
    }

    // TODO fix bugs in the looping function

    // function iterateMapping() public view returns(uint[] memory) { 
        
    //     uint[] public allBalances;

    //     for (uint _i = 0; keys.length < _i; _i++) {
    //         uint bal = balances[keys[_i]];
    //         allBalances.push(bal);
    //     }

    //     return allBalances;
    // }

}
