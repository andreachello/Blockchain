pragma solidity ^0.4.0;

/*

The creator of the contract is the chairperson who gets a weight of 2 for their vote, other of get a weight of 1

Each voter must be registered by chairperson and can only vote once

- A constant function is included to enable the client applications to call to obtain the result

- The constant modifier of the function prevents it from changing any state of the smart contract

    - This calls comes directly from the smart contract therefore is not recorder as a transaction on the blockchain
    
    
struct can be used to define mapping of addresses

*/

contract Ballot {
    
    struct Voter {
        uint weight;
        bool voted;
        uint vote;
        // address delegate;
    }
    
    // which Proposal they voted for
    struct Proposal {
        uint voteCount; // can add other data
    }
    
    // mapping from address to voter that is specified by the variable voters with the Proposal array maintains votes for each proposal    
    address chairperson;
    mapping(address => Voter) voters;
    Proposal[] proposals;
    
    // create a new ballot with _numProposals for different proposals
    function Ballot(uint8 _numProposals) public {
        chairperson = msg.sender;
        voters[chairperson].weight = 2;
        proposals.length = _numProposals;
        
    }
    
    // give voters the right to vote on this ballot, may only be called by the chairperson
    function register(address toVoter) public {
        if (msg.sender != chairperson || voters[toVoter].voted) return;
        voters[toVoter].weight = 1;
        voters[toVoter].voted = false; // because the just registered and still havenet voted
    }
    
    
    // give a single vote to a proposal
    function vote(uint8 toProposoal) public {
        Voter storage sender = voters[msg.sender];
        if (sender.voted || toProposoal >= proposals.length) return;
        sender.voted = true;
        sender.vote = toProposoal;
        proposals[toProposoal].voteCount += sender.weight;
    }
    
}







