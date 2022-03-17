//SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol"

contract UpgradeableToken is Initializable, ERC20Upgradeable, OwnableUpgradeable {
    
    // constructor() ERC20Upgradeable("UpgradeableToken", "UT") {}
    // having a constructor inside an upgradeable contract is dangerous 
    // so will need to initialize - replace constructor with an initialization
    // function - we can pass parameters to the function
    // initializer modifier: makes it such that the function can only be called once
    // similarly to constructor functions
    function initialize() external initializer {
        // need to manually call the initialization function for ERC20 and Ownable
        __ERC20_init("UpgradeableToken", "UT");
        __Ownable_init();
    }

    function mint(address to, uint amount) external onlyOwner {
        _mint(to, amount);
    }
}
