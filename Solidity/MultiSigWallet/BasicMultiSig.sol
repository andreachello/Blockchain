// SPDX-License-Identifier: MIT
pragma solidity 0.8;
pragma abicoder v2;

/*
------------------------------------------
Requirements of the smart contract wallet
------------------------------------------

– Anyone should be able to deposit ether into the smart contract

– The contract creator should be able to input 
    (1): the addresses of the owners
    (2): the numbers of approvals required for a transfer,
         in the constructor. For example, input 3 addresses and set
         the approval limit to 2. 

– Anyone of the owners should be able to create a transfer request. 
         The creator of the transfer request will specify what amount 
         and to what address the transfer will be made.

– Owners should be able to approve transfer requests.

– When a transfer request has the required approvals, the transfer 
         should be sent. 
*/

contract Wallet {

    address[] public owners;
    uint ownerLimit; // how many to approve transfer

    struct Transfer {
        uint amount;
        address payable receiver;
        uint approvals; // how many approvals has this transfer received
        bool hasBeenSent;
        uint id;
    }

    event TransferRequestCreated(uint _id, uint _amount, address _initiator, address _receiver);
    event ApprovalReceived(uint _id, uint _approvals, address _approver);
    event TransferApproved(uint _id);

    Transfer[] transferRequests;

    // Multiple approvals based on ID and flag approvals to true if approved
    // each mapping is going to point to a mapping of inputs and it is going
    // to tell the boolean of the approval
    mapping(address => mapping(uint => bool)) approvals;

    // Should only allow people in the owners list to continue execution
    modifier onlyOwners() {
        bool owner = false;
        // find if owner is in the owners list
        for (uint i=0; i < owners.length; i++) {
            if (owners[i] == msg.sender) {
                owner = true;
            }
        }
        require(owner == true);
        _;
    }

    // Should initialize the owners and the owner limit
    constructor(address[] memory _owners, uint _ownerLimit) {
        owners = _owners;
        ownerLimit = _ownerLimit; 
    }

    // can be empty as we just need to receive money in the wallet
    function deposit() public payable {}

    // create an instance of the Transfer struct and add it to the
    // transferRequests array to request money withdrawn
    function createTransfer(uint _amount, address payable _receiver) public onlyOwners {

        // check if there are funds in the contract
        require(address(this).balance > 0);

        emit TransferRequestCreated(transferRequests.length, _amount, msg.sender, _receiver);

        // we initilise the number of approvals as 0 since it is a new request
        transferRequests.push(
            Transfer(_amount, _receiver, 0, false, transferRequests.length)
        );
    }

    // Set the approval for one of the transfer requests
    // need to update the Transfer object
    // Need to update the mapping to record the approval for the msg.sender
    // When the amount of approvals for a transfer has reached the limit, this function should
    // send the transfer to the recipient 
    // An owner should not be able to vote twice
    // An owner should not be able to vote on a transfer request that has already been sent
    // input transfer id the owners want to approve
    function approve(uint _id) public onlyOwners {
        require(approvals[msg.sender][_id] == false); // not voted yet
        require(transferRequests[_id].hasBeenSent == false);

        // set the approval status to true for the owner
        approvals[msg.sender][_id] = true;
        // increase the number of approvals for the transfer request
        transferRequests[_id].approvals++;

        emit ApprovalReceived(_id, transferRequests[_id].approvals, msg.sender);

        // if transfer request has enough approvals 
        if(transferRequests[_id].approvals >= ownerLimit) {
            transferRequests[_id].hasBeenSent = true;
            // transfer call for the recipient
            transferRequests[_id].receiver.transfer(transferRequests[_id].amount);

            emit TransferApproved(_id);
        }
    }

    // Should return all transfer requests
    function getTransferRequests() public view returns(Transfer[] memory) {
        return transferRequests;
    }
}
