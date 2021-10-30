pragma solidity >= 0.7.0 < 0.9.0;

/*

Restricted Access Modifiers

By default, a contract state is read-only unless it is specified as public.

We can customize our modifiers to include the following restrictions:

- 1. onlyBy: only the mentioned caller can call this function (OnlyOwner/Change ownership)

- 2. onlyAfter: called after a certain time period

- 3. costs: call this function only if certain values are provided

*/

contract RestrictedAccess {
    address public owner = msg.sender;
    uint public creationtime = block.timestamp;
    
    // 1. onlyBy Modifier
        modifier onlyBy(address _account) {
            require(msg.sender == _account,
            "Sender is not authorized");
            _;
        }
    
    // 2. onlyAfter modifier
    
        // We can write a function that can disown the current owner (renounce ownership)
        // after a specified amount of time
        
        modifier onlyAfter(uint _time) {
            require(block.timestamp >= _time,
            "Function called too early");
            _;
        }
        
        // X weeks after the creationtime (as it is a reference timeframe)
        function disown() onlyBy(owner) onlyAfter(creationtime + 3 weeks) public {
            delete owner;
        }
        
    // 3. Costs
    
        modifier costs(uint _amount) {
            require(msg.value >= _amount,
            "Not enough Ether provided");
            _;
        }
        
        function forceOwnerChange(address _newOwner) public payable costs(200 ether) {
            owner = _newOwner;
        }
    
    // function to change owner address only if you are the owner (transfer ownership)
    function changeOwnerAddress(address _newAddress) public onlyBy(owner) {
        owner = _newAddress;
    }
}
