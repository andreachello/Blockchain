pragma solidity 0.8;

/*
Pattern 1. Eternal Storage

Keep storage but lose address, we are separating the logic from the storage

*/

// Storage smart contract that is purely storing the values
// and does not have a lot of logic


/*

How to Deploy:

1. Deploy Eternal Storage Contract

2. Deploy Ballot Contract using the Eternal Storage Address

3. Vote as to update the storage

4. Uncomment upgrade portion and redeploy Ballot Contract at same address
    as the Eternal Storage

*/

contract EternalStorage {

    // UINT Storage

    mapping(bytes32 => uint) UIntStorage;

    function getUIntValue(bytes32 record) public view returns(uint) {
        return UIntStorage[record];
    }

    function setUIntValue(bytes32 record, uint value) public {
        UIntStorage[record] = value;
    }

    // Boolean Storage

    mapping(bytes32 => bool) BooleanStorage;

    function getBooleanValue(bytes32 record) public view returns(bool) {
        return BooleanStorage[record];
    }

    function setBooleanValue(bytes32 record, bool value) public {
        BooleanStorage[record] = value;
    }
}

// Logic Smart Contract
library ballotLib {
    
    function getNumberOfVotes(address _eternalStorage) public view returns(uint256) {
        return EternalStorage(_eternalStorage).getUIntValue(keccak256("votes"));
    }

    function setVoteCount(address _eternalStorage, uint _voteCount) public {
        EternalStorage(_eternalStorage).setUIntValue(keccak256("votes"), _voteCount);
    }

    // Upgraded Part

    // function getUserHasVoted(address _eternalStorage) public view returns (bool){
    //     return EternalStorage(_eternalStorage).getBooleanValue(keccak256(abi.encodePacked("voted", msg.sender)));
    // }

    // function setUserHasVoted(address _eternalStorage) public {
    //     EternalStorage(_eternalStorage).setBooleanValue(keccak256(abi.encodePacked("voted", msg.sender)), true);
    // }
}

contract Ballot {
    using ballotLib for address;
    address eternalStorage;

    constructor(address _eternalStorage) {
        eternalStorage = _eternalStorage;
    }

    function getNumberOfVotes() public view returns(uint) {
        return eternalStorage.getNumberOfVotes();
    }

    function vote() public {

        // Upgraded part
        // require(eternalStorage.getUserHasVoted() == false, "Error User has already voted");
        // eternalStorage.setUserHasVoted();

        eternalStorage.setVoteCount(eternalStorage.getNumberOfVotes() + 1);
    }
}
