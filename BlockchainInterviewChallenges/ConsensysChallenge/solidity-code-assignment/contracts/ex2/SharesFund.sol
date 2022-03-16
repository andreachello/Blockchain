pragma solidity 0.8.7;

contract SharesFund {

   bool internal locked;

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

  mapping(address => uint256) _shares;

  function deposit() public payable {
    _shares[msg.sender] += msg.value;
  }

  function withdraw(uint256 amount) noReentrant public {
    require(_shares[msg.sender] >= amount, "Not enough shares");

    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Withdraw failed");

    if(amount > _shares[msg.sender]) {
        _shares[msg.sender] = 0;
    } else {
        _shares[msg.sender] -= amount;
    }
  }

  function shares(address addr) public view returns (uint256) {
    return _shares[addr];
  }

  function getBalance() public view returns(uint256) {
    return address(this).balance;
  }
}
