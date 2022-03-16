pragma solidity 0.8.7;

interface IVault {
  function setVaultLimit(uint) external;
}

contract VaultFactory {

  uint _vaultLimit;

  constructor(uint vaultLimit) {
    _vaultLimit = vaultLimit;
  }

  function initVault(IVault vault) public payable {
    require(msg.value <= _vaultLimit, "Cannot deposit more than the max vault capacity");
    vault.setVaultLimit(_vaultLimit);
    address payable vaultAddress = payable(address(vault));
    vaultAddress.call{value: msg.value}("");
  }
}