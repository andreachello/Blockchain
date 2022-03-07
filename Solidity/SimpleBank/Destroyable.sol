// SPDX-License-Identifier: MIT
pragma solidity 0.8;

import "./Ownable.sol";

contract Destroyable is Ownable {

  function destroy() public onlyOwner {
    address receiver = msg.sender;
    selfdestruct(payable(receiver));
  }
}
