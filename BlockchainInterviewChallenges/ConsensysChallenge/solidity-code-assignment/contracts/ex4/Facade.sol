pragma solidity 0.8.7;

contract Facade {

  function set(address contractAddress, string memory val) public {
    (bool success, bytes memory data) = address(contractAddress).call(abi.encodeWithSignature("set(string)", val));
    require(success, "Failed");
  }
  fallback() external payable {}
}


