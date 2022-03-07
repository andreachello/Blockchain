// SPDX-License-Identifier: MIT
pragma solidity 0.8;

import "./Ownable.sol";
import "./Destroyable.sol";

interface IGovernment {
    function addTransaction(address _from, address _to, uint _amount) external payable;
}

contract Bank is Ownable, Destroyable {

    // Create contract instance from Interface - DEPLOY GOVERNMENT CONTRACT and get ADDRESS
    IGovernment GovernmentInstance = IGovernment(0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3);

    mapping(address => uint) balance;

    event depositDone(uint amount, address indexed depositedTo);

    function deposit() public payable returns (uint) {
        balance[msg.sender] += msg.value;

        emit depositDone(msg.value, msg.sender);

        return balance[msg.sender];
    }

    function withdraw(uint _amount) public returns(uint) {
        require(balance[msg.sender] >= _amount);
        payable(msg.sender).transfer(_amount);
        balance[msg.sender] -= _amount;
        return balance[msg.sender];
    }

    function getBalance() public view returns(uint) {
        return balance[msg.sender];
    }

    function transfer(address recepient, uint _amount) public {
        require(balance[msg.sender] >= _amount, "Balance not sufficient");
        require(msg.sender != recepient, "Cannot send money to yourself");

        uint previousSenderBalance = balance[msg.sender];
        _transfer(msg.sender, recepient, _amount);

        assert(balance[msg.sender] == previousSenderBalance - _amount);

        GovernmentInstance.addTransaction{value: 1 ether}(msg.sender, recepient, _amount);
    }

    function _transfer(address _from, address _to, uint _amount) private {
        balance[_from] -= _amount;
        balance[_to] += _amount;
    }
}
