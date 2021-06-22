/*

1. Modifiers: can change the behavior of a function

It is executed before the execution of the function begins (like a signal in Django). 

It checks a condition using a require and if the condition failed the transaction that called the function will reject the transaction and revert 
all state changes so there is no recording on the blockchain of that transaction


EXAMPLE USING BALLOTS:

- Define Modifier for clause "only By(chairperson)"

- Adding the special notation (_;) to the modifier definition that includes the function 

- Using the modifier clause in the function header

*/


// STEP 1 

// modifier onlyBy(address _account) {
//     require(msg.sender == _account);
    
//     // STEP 2: shows how to make the modifier include a placeholder for any function
//     _;
// }

// STEP 3:

// header function register(address toVoter)

// public onlyBy(chairperson) {
//     if (voters[toVoter].voted) return;
//     voters[toVoter].weight = 1;
//     voters[toVoter].voted = false;
// }

/*

Stages => Init => Reg => Vote => Done

- Init at time of  deployment of contract

- In the constructor, the Init is changed to Reg

- After registration period is over there is the voting period

- After time elapsed from voting the state changes to Done

**** modifiers are like mixins in Django ****

*/

pragma solidity ^0.4.0;

contract Ballot {
    
    struct Voter {
        uint weight;
        bool voted;
        uint8 vote;
        address delegate;
    }
    
    // which Proposal they voted for
    struct Proposal {
        uint voteCount; // can add other data
    }
    
    // Enum for Stages
    enum Stage {Init, Reg, Vote, Done}
    Stage public stage = Stage.Init;
    
    // mapping from address to voter that is specified by the variable voters with the Proposal array maintains votes for each proposal    
    address chairperson;
    mapping(address => Voter) voters;
    Proposal[] proposals;
    
    event votingCompleted;
    
    uint startTime;
    
    // modifiers similar concept as mixin in django
    
   modifier validStage(Stage reqStage)
    { require(stage == reqStage);
      _;
    }
    
    
    /// Create a new ballot with $(_numProposals) different proposals.
    function Ballot(uint8 _numProposals) public  {
        chairperson = msg.sender;
        voters[chairperson].weight = 2; // weight is 2 for testing purposes
        proposals.length = _numProposals;
        stage = Stage.Reg;
        startTime = now;
    }
    
    /// Give $(toVoter) the right to vote on this ballot.
    /// May only be called by $(chairperson).
    function register(address toVoter) public validStage(Stage.Reg) {
        //if (stage != Stage.Reg) {return;}
        if (msg.sender != chairperson || voters[toVoter].voted) return;
        voters[toVoter].weight = 1;
        voters[toVoter].voted = false;
        if (now > (startTime+ 30 seconds)) {stage = Stage.Vote;}        
    }
    
    
    // Give a single vote to proposal $(toProposal).
    function vote(uint8 toProposal) public validStage(Stage.Vote)  {
       // if (stage != Stage.Vote) {return;}
        Voter storage sender = voters[msg.sender];
        if (sender.voted || toProposal >= proposals.length) return;
        sender.voted = true;
        sender.vote = toProposal;   
        proposals[toProposal].voteCount += sender.weight;
        if (now > (startTime+ 30 seconds)) {stage = Stage.Done; votingCompleted();}        
        
    }
    
    
    function winningProposal() public validStage(Stage.Done) constant returns (uint8 _winningProposal) {
       //if(stage != Stage.Done) {return;}
        uint256 winningVoteCount = 0;
        for (uint8 prop = 0; prop < proposals.length; prop++)
            if (proposals[prop].voteCount > winningVoteCount) {
                winningVoteCount = proposals[prop].voteCount;
                _winningProposal = prop;
            }
       assert (winningVoteCount > 0);

    }
}
