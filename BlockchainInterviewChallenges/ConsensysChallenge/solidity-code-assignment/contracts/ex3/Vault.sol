pragma solidity 0.8.7;

/**
  * Do not modify this contract
 */
contract Vault {

  int _vaultLimit;

  function setVaultLimit(int vaultLimit) public {
    _vaultLimit = vaultLimit;
  }

  receive() external payable {
    require(_vaultLimit == -1 || address(this).balance <= uint(_vaultLimit), "Vault limit reached");
    // transfer accepted
  }

  fallback() external {
    // set to unlimited mode
    _vaultLimit = -1;
  }

}
