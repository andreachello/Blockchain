pragma solidity ^0.5.0;

contract Reward {
    string public name = "Reward Token";
    string public symbol = "RWD";
    uint public totalSupply = 1000000000000000000000000; // 1 mil tokens 18 + 6 zeroes
    uint public decimals = 18; 

    // indexed allows to index through the addresses
    event Transfer (
        address indexed _from,
        address indexed _to,
        uint _value
    );

    event Approval (
        address indexed _owner,
        address indexed _spender,
        uint _value
    );

    // keep track of balance for transfering and updating
    mapping(address => uint) public balanceOf;

    // allowance mapping
    mapping(address => mapping(address => uint)) public allowance;

    // initial deployment will send all of the supply to the deployer
    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint _value) public returns(bool success) {
        // require that the value is greate than or equal to the transfer amount
        require(balanceOf[msg.sender] >= _value);
        // transfer amount by subtracting the balance from the sender
        balanceOf[msg.sender] -= _value;
        // transfer amount by the balance to the receiver
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint _value) public returns (bool success) {
        // the spender addresses are equal to the value 
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // for 3rd party platforms
    function transferFrom(address _from, address _to, uint _value) public returns(bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        
        // add the balance
        balanceOf[_to] += _value;
        // substract function
        balanceOf[msg.sender] -= _value;

        // the caller's allowance from the sender is reduced from the amount
        allowance[msg.sender][_from] -= _value;

        emit Transfer(_from , _to, _value);
        return true;
    }
}