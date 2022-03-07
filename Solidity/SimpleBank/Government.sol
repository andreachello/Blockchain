// SPDX-License-Identifier: MIT
pragma solidity 0.8;

contract Government {

    struct Transaction {
        address from;
        address to;
        uint amount;
        uint txId;
    }

    Transaction[] transactionLog;

    function addTransaction(address _from, address _to, uint _amount) external payable {
        transactionLog.push(Transaction(_from, _to, _amount, transactionLog.length));
    }

    function getTransaction(uint _index) public view returns(address, address, uint) {
        return (transactionLog[_index].from, transactionLog[_index].to, transactionLog[_index].amount);
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }
}
