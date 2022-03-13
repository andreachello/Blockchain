// SPDX-License-Identifier: MIT
pragma solidity 0.8;

contract AccessControl {
    // Manage roles assigned to accounts, depending on the role
    // the accounts can access different functions

    // Events from Granting and Revoking a role
    event GrantRole(bytes32 indexed role, address indexed account);
    event RevokeRole(bytes32 indexed role, address indexed account);

    // Store if an account has a role 
    // bytes32 given we are hashing the name of the role
    mapping(bytes32 => mapping(address => bool)) public roles;

    // define ADMIN role and USER role
    // We can recompute the hash of the role off-chain and we
    // do not have to store it on-chain as a public variable
    // better for gas optimization
    // We can get the has for testing by making it public
    bytes32 private constant ADMIN = keccak256(abi.encodePacked("ADMIN"));
    bytes32 private constant USER = keccak256(abi.encodePacked("USER"));

    // Grant roles to an account - internal and external function use
    // internal for inheritance reasons
    function _grantRole(bytes32 _role, address _account) internal {
        // set the role for the account to be true
        roles[_role][_account] = true;

        emit GrantRole(_role, _account);
    }

    // only role modifier
    modifier onlyRole(bytes32 _role) {
        require(roles[_role][msg.sender], "Not authorized");
        _;
    }

    // grant ADMIN role to deployer
    constructor() {
        _grantRole(ADMIN, msg.sender);
    }

    // External Function for Grant role - wrap the internal function
    // with an external function
    // Only the ADMIN can grant a role
    function grantRole(bytes32 _role, address _account) external onlyRole(ADMIN){
        _grantRole(_role, _account);
    }

    // Revoke role
    function revokeRole(bytes32 _role, address _account) external onlyRole(ADMIN){
        // set the role for the account to be false
        roles[_role][_account] = false;

        emit RevokeRole(_role, _account);
    }
}
