pragma solidity 0.8;

contract TestContract1 {
    address public owner = msg.sender;

    function setOwner(address _owner) public {
        require(msg.sender == owner, "not owner");
        owner = _owner;
    }
}

contract TestContract2 {
    address public owner = msg.sender;
    uint public value = msg.value;
    uint public x;
    uint public y;

    constructor(uint _x, uint _y) payable {
        y = _y;
        x = _x;
    }
}

contract Proxy {

    // when calling a contract it might send ether back so we need a fallback
    fallback() external payable {}

    event Deploy(address);

    function deploy(bytes memory _code) external payable returns(address addr) {
       
        assembly {
            // the first 32 bytes encodes the length of the code and 
            // actual code after 32 bytes so we can skip them (to 0x20)
            addr := create(callvalue(), add(_code, 0x20), mload(_code))
        }

        require(addr != address(0), "deploy failed");
        
        emit Deploy(addr);
    }

    // function needed to execute other smart contract functions from the data
    function execute(address _target, bytes memory _data) external payable {
        (bool success, ) = _target.call{value: msg.value}(_data);
        require(success, "failed");
    }
}

// contract to get the bytecode of the contracts
contract Helper {

    function getBytecode1() external pure returns (bytes memory) {
        bytes memory bytecode = type(TestContract1).creationCode;
        return bytecode;
    }

    // here we have to specify the inputs
    function getBytecode2(uint _x, uint _y) external pure returns (bytes memory) {
        bytes memory bytecode = type(TestContract2).creationCode;
        // append inputs to bytecode
        return abi.encodePacked(bytecode, abi.encode(_x, _y));
    }

    // get data to execute a function on a contract
    function getCalldata(address _owner) external pure returns (bytes memory) {
        return abi.encodeWithSignature("setOwner(address)", _owner);
    }

}
