pragma solidity 0.8.7;

contract SimpleToken {

  address _owner;
  // balance of addresses
  mapping(address=>uint) public balances;

  modifier onlyOwner {
    require(msg.sender == _owner);
    _;
  }

  constructor() {
    _owner = msg.sender;
  }

     // mint the coin:
    // - make new coins and send them to an address
    // - only the owner can send these coins
    function mint(address receiver, uint amount) external onlyOwner {
        
        // send amount to the receiver contract address
        // be able to increase the supply or amount each time
        balances[receiver] += amount;
    }

function balanceOf(address tokenOwner) public view returns (uint) {
  return balances[tokenOwner];
}
}
