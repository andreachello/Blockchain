pragma solidity 0.8;

/*
Design:

1. Regular Call:

A calls B, sends 100 wei
        B calls C, sends 50 wei

A ----> B ----> C
                @C:
                msg.sender = B
                msg.value = 50
                execute code on C's state variables
                use ETH in C (if queries from another contract)

2. Delegate Call: (preserves the context)

A calls B, sends 100 wei
        B delegatecall C

A ----> B -----------> C 
                       @C:
                       msg.sender = A
                       msg.value = 100
                       execute code on B's state variables
                       use ETH in B (if queries from another contract)

*/

contract TestDelegateCall {
    uint public num;
    address public sender;
    uint public value;

    function setVars(uint _num) external payable {
        num = _num;
        sender = msg.sender;
        value = msg.value;
    }
}

contract DelegateCall {
    uint public num;
    address public sender;
    uint public value;

    // delegate the call 
    function setVars(address _test, uint _num) external payable {
        // Standard way
        (bool success, bytes memory data) = _test.delegatecall(
            abi.encodeWithSignature("setVars(uint256)", _num));
        
        // Using Selectors
        //(bool success, ) = _test.delegatecall(
        //        abi.encodeWithSelector(TestDelegateCall.setVars.selector, _num)           
        //    );
        
        require(success, "failed");
    }

}
