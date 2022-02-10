// SPDX-License-Identifier: MIT
pragma solidity 0.8;

/*

Pattern 3. Proxy Contract: EIP-897 Delegate Proxy

Keep the address and potentially either keep storage or lose storage 
and collision prevention - downside is that we still have to inherit the proxy

*/

/*

How to Deploy:

- 1. Deploy NotLostStorage Contract

- 2. Deploy ProxyNoMoreClash Contract using the NotLostStorage address as input

- 3. Redeploy the NotLostStorage contract under the Proxy's address

*/

// Proxy storage contract that stores the logic 
// The different slot storages are to avoid collision so as to not start
// both addresses from storage at slot 0
contract ProxyStorage {
    // Slot 0 storage address
    address public otherContractAddress;

    function setOtherAddressStorage(address _otherContract) internal {
        otherContractAddress = _otherContract;
    }
}

contract NotLostStorage is ProxyStorage {
    // Slot 1 storage address
    address public myAddress;
    // Slot 2 storage UINT
    uint public myUint;

    function setAddress(address _address) public {
        myAddress = _address;
    }

    function setMyUint(uint _uint) public {
        myUint = _uint;
    }

}


contract ProxyNoMoreClash is ProxyStorage {

    constructor(address _otherContract) {
        setOtherAddress(_otherContract);
    }

    function setOtherAddress(address _otherContract) public {
        super.setOtherAddressStorage(_otherContract);
    }

  /**
  * @dev Fallback function allowing to perform a delegatecall to the given implementation.
  * This function will return whatever the implementation call returns
  */
  fallback() payable external {
    address _impl = otherContractAddress;

    assembly {
      let ptr := mload(0x40) // The content of address 0x40 is the next free memory address
      calldatacopy(ptr, 0, calldatasize())
      let result := delegatecall(gas(), _impl, ptr, calldatasize(), 0, 0)
      let size := returndatasize()
      returndatacopy(ptr, 0, size)

      switch result
      case 0 { revert(ptr, size) }
      default { return(ptr, size) }
    }
  }
}
