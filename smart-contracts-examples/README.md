# How to Design a Smart Contract

### Example: Ballot Problem

## 1. Problem Statement

### Version 1:

An organization invites proposals for a project, a chairperson organizes this process. The number of proposals is specified at the time of creation of the smart contract. The chairperson registers all the voters. The voters, inlcuding the chairperson, vote on the proposal. The weight of the chairperson is 2 and for all others is 1.

## 2. Analyze Problem

Consider the data and functions of the problem

#### Key Differences from Tradition OOP

- Address
- Msg.sender

## 3. Use Class Diagrams to Represent Design

| Ballot | Meaning |
| -- | -- |
| struct Voter; |The object notation for the voter|
| struct Proposal;|The object notation for the proposal|
|Proposal[] proposals;|The array containing the different proposals|
|mapping(address => Voter) voters;|Address of a voter will be used as a key to map to the details of the voter|
|address chairperson;|Giving the main address to the chairperson, creator of smart contract|

| Function | Meaning |
|--| -- |
|Ballot()|Is the Constructor function, i.e. fucntion thatis called to create the smart contract (only one constructor can be used with same name as contract. In this case the chairperson will be the one calling this constructor function|
|register()|Function to reigster the voter. Only the chairperson can register a voter. The sender of the message for the registration has to be the chairperson| 
|vote()|Voters incl. the chairperson can vote for a proposal|
|winningProposal()|Determines the winning proposal and can be called in client applications|

## 4. Define the Visibility for the State Variables and Functions (Public vs. Private)

The visibility modifiers for the state variables and the functions represent the details of a single voter using a struct.

## 5. Define Access Modifiers for the Functions

## 6. Define Validations for Input Variables of the functions

## 7. Define Conditions that Must Hold True

On completion of critical operations within functions

## 8. Express Conditions that were Discovered

in steps using assert and require statements
