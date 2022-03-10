// SPDX-License-Identifier: MIT
pragma solidity 0.8;

/**
 * @title ERC20 standard token implementation.
 * @dev Standard ERC20 token. This contract follows the implementation at https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md.
 */
contract Token {
  /*
   * Token name.
   */
  string internal tokenName;

  /*
   * Token symbol.
   */
  string internal tokenSymbol;

  /*
   * Number of decimals.
   */
  uint8 internal tokenDecimals;

  /*
   * Total supply of tokens.
   */
  uint256 internal tokenTotalSupply;

  /*
   * Balance information map.
   */
  mapping (address => uint256) internal balances;

  /*
   * Token allowance mapping.
   *
   * require two keys to get to a value - allow a smart contract to spend an address's X amount of balance
   * where the first address is the spender address and the second address is the smart contract address
   */
  mapping (address => mapping (address => uint256)) internal allowed;

  /*
   * @dev Trigger when tokens are transferred, including zero value transfers.
   */
  event Transfer(address indexed _from,address indexed _to, uint256 _value);

  /*
   * @dev Trigger on any successful call to approve(address _spender, uint256 _value).
   */
  event Approval(address indexed _owner,address indexed _spender,uint256 _value);
  
  constructor(string memory _name, string memory _symbol, uint8 _decimals, uint _initialOwnerBalance) {
      tokenName = _name;
      tokenSymbol = _symbol;
      tokenDecimals = _decimals;
      tokenTotalSupply = _initialOwnerBalance;
      balances[msg.sender] = _initialOwnerBalance;
  }

  /*
   * @dev Returns the name of the token.
   */
  function name() external view returns (string memory _name){
    _name = tokenName;
  }

  /*
   * @dev Returns the symbol of the token.
   */
  function symbol() external view returns (string memory _symbol){
    _symbol = tokenSymbol;
  }

  /*
   * @dev Returns the number of decimals the token uses.
   */
  function decimals() external view returns (uint8 _decimals){
    _decimals = tokenDecimals;
  }

  /*
   * @dev Returns the total token supply.
   */
  function totalSupply() external view returns (uint256 _totalSupply){
    _totalSupply = tokenTotalSupply;
  }

  /*
   * @dev Returns the account balance of another account with address _owner.
   * @param _owner The address from which the balance will be retrieved.
   */
  function balanceOf(address _owner) external view returns (uint256 _balance){
    _balance = balances[_owner];
  }

  /*
   * @dev Transfers _value amount of tokens to address _to, and MUST fire the Transfer event. The
   * function SHOULD throw if the "from" account balance does not have enough tokens to spend.
   * @param _to The address of the recipient.
   * @param _value The amount of token to be transferred.
   */
  function transfer(address payable _to, uint256 _value) public returns (bool _success){
    
    // check if the sender how enough tokens to spend
    require(balances[msg.sender] >= _value, "Balance insufficient");

    // Transfer tokens
    balances[msg.sender] -= _value;
    balances[_to] += _value;

    // Fire Transfer event
    emit Transfer(msg.sender, _to, _value);

    _success = true;
  }

  /*
   * @dev Allows _spender to withdraw/transfer from your account multiple times, up to the _value amount. If
   * this function is called again it overwrites the current allowance with _value. SHOULD emit the Approval event.
   * @param _spender The address of the account able to transfer the tokens.
   * @param _value The amount of tokens to be approved for transfer.
   */
  function approve(address _spender, uint256 _value) public returns (bool _success) {

    // Check that the sender has enough balance
    require(balances[_spender] >= _value, "Spender does not have enough funds");

    // allowance is overridden each time
    allowed[msg.sender][_spender] = _value;

    // fire the Approval event
    emit Approval(msg.sender, _spender, _value);

    _success = true;
  }

  /*
   * @dev Returns the amount which _spender is still allowed to withdraw from _owner.
   * @param _owner The address of the account owning tokens.
   * @param _spender The address of the account able to transfer the tokens.
   */
  function allowance(address _owner,address _spender) external view returns (uint256 _remaining){
    _remaining = allowed[_owner][_spender];
  }

  /*
   * @dev Transfers _value amount of tokens from address _from to address _to, and MUST fire the
   * Transfer event.
   * @param _from The address of the sender.
   * @param _to The address of the recipient.
   * @param _value The amount of token to be transferred.
   */
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool _success){

    // get remaining allowance and check that the allowance is greater than or equal to the value
    // the msg.sender in this case is the third party that wants to spend the amount of the
    // _from address
    uint remainingAmount = allowed[_from][msg.sender];
    require(balances[_from] >= _value, "Balance insufficient");
    require(remainingAmount >= _value, "Balance not enough");

    // Transfer funds
    balances[_from] -= _value;
    balances[_to] += _value;

    // reduce allowance
    allowed[_from][msg.sender] -= _value;

    // Fire Transfer event
    emit Transfer(_from, _to, _value);

    _success = true;
  }

}
