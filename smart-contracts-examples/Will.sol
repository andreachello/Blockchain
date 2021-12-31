pragma solidity >=0.7.0 <0.9.0;

contract Will {
    address owner;
    uint fortune;
    bool deceased;

    constructor() payable public {
        owner = msg.sender;
        fortune = msg.value;
        deceased = false;
    }

    // create modifier so only person that can call is owner
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    // modifier so that we can allocate allocate funds if friend's grandpa gramparents are deceased
    modifier mustBeDeceased {
        require(deceased == true);
        _;
    }

    // array of addresses
    address payable [] familyWallets;

    mapping(address => uint) inheritance;

    // set inheritance for each address
    function setInheritance(address payable wallet, uint amount) public onlyOwner { 
        familyWallets.push(wallet);
        inheritance[wallet] = amount;
    }

    // pay each family member based on wallet address
    function payout() private mustBeDeceased  {
    
        for (uint i=0; i < familyWallets.length; i++) {
            familyWallets[i].transfer(inheritance[familyWallets[i]]);
        }
    }

    function isDeceased() public onlyOwner {
        deceased = true;
        payout();
    }
}
