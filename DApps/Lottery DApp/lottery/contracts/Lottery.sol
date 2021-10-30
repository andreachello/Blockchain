pragma solidity ^0.4.17;

contract Lottery {
    
    // store the people playing the Lottery game
    address public manager;
    address[] public players;
    
    // set the variable manager the second an address creates a lotters (deploys contract)
    // this is done through the constructor function that acts as an aumotatic call
    function Lottery() public {
    // we use the global msg object that describes the address and the transaction/call
        manager = msg.sender;
    }
    
    // enter the address in the Lottery, payable when someone calls thie function they 
    // will need to send ether
    function enter() public payable {
        // if it evaluates to true then it executed rest of code else it exits out
        require(msg.value > 0.0001 ether);
        
        // insert the player in the players array (i.e. the address that calls this function)
        players.push(msg.sender);
    }
    
    // pseudo random number generator that takes into block difficulty, current time and list of players
    // and generate a big number through sha3 (keccak256) but it is not a good solution (all are global)
    function random() private view returns (uint){
        return uint(keccak256(block.difficulty, now, players));
    }
    
    // use modifiers (like mixins in django) in order to restrict access
    modifier restricted() {
        
        // require that only the manager can call this function i.e. pick a winner
        require(msg.sender == manager);
        _; // takes out all code from any function containing the modifier mixin and replaces it here
    }
    
    // we pick a winner by taking the modulo of the large pseudo random number and the length of the
    // array of players. This should return indices between 0 and length of array minus 1 
    function pickWinner() public restricted {
        
        uint index = random() % players.length;
        players[index].transfer(this.balance); // address that won (this contract balance)
        
        // reset player arrays so reset Lottery
        players = new address[](0); // initial size of zero
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
}