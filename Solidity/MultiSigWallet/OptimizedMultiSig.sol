// SPDX-License-Identifier: MIT
pragma solidity 0.8;

contract MultiSigWallet {
    // events
    event Deposit(address indexed sender, uint indexed value);
    event Submit(uint indexed txId); // when transaction is submitted for owners to approve
    event Approve(address indexed onwer, uint indexed txId); // when owner approves
    event Revoke(address indexed owner, uint indexed txId); // when owner revokes approval
    event Execute(uint indexed txId); // when transfer is executed

    // array of owners
    address[] public owners;
    // check that the address we are passing is an owner 
    mapping(address => bool) public isOwner;

    // once a transaction has been submitted to the contract other owners will have to approve it in order for
    // it to pass/executed
    // number of approvals required before transaction is executed
    uint public required;

    // Define transaction struct
    struct Transaction {
        address to;
        uint value;
        bytes data; // data sent to address
        bool executed;
    }

    // store array of transactions in a struct
    Transaction[] public transactions;

    // store transaction approval for each transaction by each owner 
    // index of transaction --> whether a transaction is approved by an owner or not
    mapping(uint => mapping(address => bool)) public approved;

    modifier onlyOwner {
        require(isOwner[msg.sender], "Not Owner");
        _;
    }

    // check if the transaction exists - if the id is less than the length of the transaction array
    modifier txExists(uint _txId) {
        require(_txId < transactions.length, "Transaction does not exist");
        _;
    }

    // check if the transaction has not been approved yet by the owner (msg.sender)
    // !approved[][] same as approved[][] == false
    modifier notApproved(uint _txId) {
        require(!approved[_txId][msg.sender] , "Transaction already approved");
        _;
    }

    // check that the transaction has not yet been executed
    modifier notExecuted(uint _txId) {
        require(!transactions[_txId].executed, "Transaction has already been executed");
        _;
    }

    constructor(address[] memory _owners, uint _required) {
        // require at least one owner
        require(_owners.length > 0, "Owners are required");
        // require the approval threshold to be greater than 0 and less than the number of owners
        require(
            _required > 0 && _required <= _owners.length,
            "Invalid required number of owners"
        );

        // save owners to the state variable
        // make sure that owners is not equal to the null address
        // onwer needs to be unique
        for(uint i; i < _owners.length; i++) {
            // get address of the owner from the array
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner");

            // uniqueness of owner check - check that the owner is not inserted into the isOwner
            require(!isOwner[owner], "Owner is not unique");

            // insert new owner into the isOwner mapping and then push it into the owners array
            isOwner[owner] = true;
            owners.push(owner);
        }

        // set required to the input
        required = _required;
    }

    // enable receiving of Ether
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    // Submit a new transaction to be approved
    function submit(address _to, uint _value, bytes calldata _data) 
        external
        onlyOwner
    {
        // push all parameters to the transactions array using the struct
        transactions.push(Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false
        }));

        // transaction id as input
        emit Submit(transactions.length - 1);
    }

    // approve transaction as an owner
    function approve(uint _txId) 
        external
        onlyOwner
        txExists(_txId)
        notApproved(_txId)
        notExecuted(_txId)
    {
        // flag the approved status of the transaction by the msg.sender as approved
        approved[_txId][msg.sender] = true;
        emit Approve(msg.sender, _txId);
    }

    // get approval count
    function _getApprovalCount(uint _txId) private view returns(uint count) {
        for (uint i; i < owners.length; i++) {
            // if the owner has approved the specific transaction
            if(approved[_txId][owners[i]]) {
                count +=1;
            }
        }

        return count;
    }

    // execute transfer function
    function execute(uint _txId) external txExists(_txId) notExecuted(_txId) {
        // make sure that the number of approvals is greater than required
        require(_getApprovalCount(_txId) >= required, "Approvals are less than the required number");

        // update Transaction struct for that particular transaction - in storage - permanently
        Transaction storage transaction = transactions[_txId];

        // set executed to true
        transaction.executed = true;

        // execute transaction
        (bool success, ) = transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "Transcation failed");

        // emit event
        emit Execute(_txId);
    }

    // if owner approves transaction and wants to revoke before the approval limit has been reached
    // they can revoke their approval
    function revoke(uint _txId) external onlyOwner txExists(_txId) notExecuted(_txId) {
        // for an owner to revoke a transaction they must have first approved it
        // so check that the transaction has been approved by owner
        require(approved[_txId][msg.sender], "Transaction not approved");
        
        // set the flag for the transaction approval to false
        approved[_txId][msg.sender] = false;
        emit Revoke(msg.sender, _txId);
    }
}
