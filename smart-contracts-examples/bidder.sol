/* Basic Types and Statements*/


/* uint = unisgned int  of 256 bits*/

pragma solidity ^0.4.0;

contract Bidder {
    string public name;
    uint public bidAmount = 200000;
    bool public eligible;
    uint constant minBid = 1000;
    
    function setName(string nm) public {
        name = nm;
    }
    
    function setBidAmount(uint x) public {
        bidAmount = x;
    }
    
    function determineEligibility() public {
        if  (bidAmount >= minBid) eligible = true;
        else eligible = false;
    }
}
