// SPDX-Licence-Identifier: MIT
pragma solidity 0.5.6;

import "./SafeMath.sol";

/*
System where different system administrators can decide - depening on their risk tolerance.

Risk Managament Parameters:
- Minimum Stability Fee + 1%
- Maximum Stability Fee + 5%
- Coverage + 5%
- Flat Fee + 1%
- Monthly Fee + 0.15% (Increased risk as maturity increases)
- Multiple FRAs are possible

Trigger Swap:
If at any point in time the stability fee exceeds the current plus the coverage,
allow the FRA to be executed early and the buyer will receive its coverage
*/

/*
* Example Parameters:

Flat Fee: 1% -> 10000000000000000
Monthly Fee: 1.5% -> 15000000000000000
Minimum Rate to insure FRA: 2% -> 20000000000000000
Maximum Rate to insure FRA: 12% (above Kovan Testnet rate) -> 120000000000000000
Coverage: 5% -> 50000000000000000
*/


contract ForwardRateAgreementMain {
    /*
    * State Variables
    */ 
    using SafeMath for uint;

    // Mappings
    // Internal Accessibility 
    
    mapping(address => mapping(uint => FRA)) public Forward_Rate_Agreements;
    mapping(address => uint) public Forward_Count; // checks how many FRAs each address has made
   
    // Front-End Helper Section
    /*
    Needed to see all the contracts from the admin side so they can execute or expire them:
    - The first time a user creates an FRA the status of their address is set to false
    - Then it is set to the active state to true to that user
    */
    mapping(address => bool) public User_Is_Active;
    mapping(uint => address) public Active_User_List;
    uint public Active_User_Count; // iterate through the mapping using the user count for active users - load all

    address public Admin;

    address public Kovan_DAI = 0xC4375B7De8af5a38a93548eb8453a498222C4fF2; // Kovan Test DAI Deployed CA 
    address public Kovan_SF = 0xa71937147b55Deb8a530C7229C442Fd3F31b7db2;  // Stabilty Fee Contract

    // params that admin is going to set 
    uint public Flat_Fee; //18d
    uint public Monthly_Fee; //18d
    uint public Min_Stability_Fee; //18d
    uint public Max_Stability_Fee; //18d
    uint public Coverage;

    // how much DAI is avaiable for a buyer to buy and get coverage with 
    // - if coverage is 5% and notional is 500 then DAI available should be higher than 5% * 500
    uint public DAI_Available;

    // if you are an admin and want a contract to be locked given risk changes and need to stop providing coverage
    // so no FRAs can be created with the terms being specified for that FRA
    bool public Contract_Locked;

    // Prevents against Reentrency attacks
    uint private _guardCounter;

    // Data Structures
    

    enum State { Inactive, Active, Executed, Triggered, Expired}

    struct FRA {
        uint Start_Unix; // start date in Unix time
        uint End_Unix; // end date in Unix time
        uint End_Cutoff_Unix; // when the FRA expires - Maturity date - with a 1 day grace period (beyond that it is not excercisable)
        uint Notional; // 18 decimals
        uint Starting_Stability_fee;

        address Borrower;

        // to track what state the contract is in and in what state has ended in
        // The first one will always be inactive, i.e. the default value for initialisation
        State Forward_State;
    }

    /*
    * Constructor
    */

    constructor(uint _flatFee, uint _monthlyFee, uint _minRate, uint _MaxRate, uint _coverage) public {
        require(_minRate < _MaxRate);

        Admin = msg.sender;

        Flat_Fee = _flatFee;
        Monthly_Fee = _monthlyFee;
        Min_Stability_Fee = _minRate;
        Max_Stability_Fee = _MaxRate;
        Coverage = _coverage;

        _guardCounter = 1;
    }

    /*
    * Modifiers
    */

    modifier nonReentrant() {
        _guardCounter += 1;
        uint256 localCounter = _guardCounter;
        _;
        require(localCounter == _guardCounter);
    }

    modifier isAdmin() {require(msg.sender == Admin); _;}
    modifier notAdmin() {require(msg.sender != Admin); _;}
    modifier isLocked() {require(Contract_Locked); _;}
    modifier isUnlocked() {require(!Contract_Locked); _;}

    /*
    *   Functions
    */

    // Admin

    // fill the contract - 
    // i.e. add DAI to liquidity 
    // (DAI_Available will increase and is also be used a as reference to how much DAI
    // can be withdrawn from the contract by an admin)

    function fill(uint _amount) public isAdmin nonReentrant returns (bool) {
        // Admin need to approve before the transferFrom will be done
        // transfer DAI from admin to contract - require because the function returns true
        require(IERC20(Kovan_DAI).transferFrom(Admin, address(this), _amount));
        // add amount to available DAI state variable
        DAI_Available = DAI_Available.add(_amount);
        return true;        
    }

    function withdraw(uint _amount) public isAdmin nonReentrant returns (bool) {
        // do not allow to withdraw all DAI from escrow - use the internal accounting state variable of DAI_Available
        require(DAI_Available > _amount); 
        DAI_Available = DAI_Available.sub(_amount);
        // Call the IERC20 Interface for the test DAI - Transfer because it is internal
        require(IERC20(Kovan_DAI).transfer(Admin, _amount));
        return true;
    }

    function lock() public isAdmin isUnlocked nonReentrant returns (bool) {
        Contract_Locked = true;
        return true;
    }

    function unlock() public isAdmin isLocked nonReentrant returns (bool) {
        Contract_Locked = false;
        return true;
    }

    /*
    *   Buyer
    */

    function createFRA(uint _notional, uint _months) public isUnlocked notAdmin nonReentrant returns(bool) {
        
        // require that months are positive and less than 1 year
        require(_months > 0 && _months <= 12);

        // Fee requirements
        uint Current_SF = realFee();
        require(Current_SF >= Min_Stability_Fee);
        require(Current_SF <= Max_Stability_Fee);

        // Has the user created an FRA before
        // Add User to List if not active and not in list and set active to true
        if (!User_Is_Active[msg.sender]) {
            User_Is_Active[msg.sender] = true;
            // Active_User_List maps the count as uint to the address, i.e. sets the id of latest entry to the
            // newest address being inserted
            Active_User_List[Active_User_Count] = msg.sender;
            Active_User_Count ++;
        }

        // Create a new FRA corresponding to the user address in the mapping - reference the uint id to the FRA struct
        Forward_Rate_Agreements[msg.sender][Forward_Count[msg.sender]] = FRA(
            now, // start - 2592000 seconds in a month
            now + 2592000 + _months, // end
            now + 2592000 + _months + 86400, // end cutoff - 86400 seconds in a day => grace period
            _notional, // notional
            Current_SF, // starting stability fee
            msg.sender, // borrower
            State.Active // change state to active
        );

        // only one id per FRA each time 
        Forward_Count[msg.sender] ++;

        // Base DAI for buyer, admin and fees - internal accounting for the base calculations
        uint Base_DAI_Buyer = _notional.mul(Current_SF).div(10 ** 18);
        uint Base_Fee_Buyer = _notional.mul(Flat_Fee + Monthly_Fee * _months).div(10 ** 18);
        uint Base_DAI_Admin = _notional.mul(Coverage).div(10 ** 18); // admin filled contract with DAI - must put up coverage

        // this is what is locked for this specific FRA - need to lower the amount of DAI avaiable
        require(DAI_Available >= Base_DAI_Admin);
        DAI_Available = DAI_Available.sub(Base_DAI_Admin);

        // send the buyer's collateral to the CA
        require(IERC20(Kovan_DAI).transferFrom(msg.sender, address(this), Base_DAI_Buyer));
        // send the fee the buyer pays to the admin
        require(IERC20(Kovan_DAI).transferFrom(msg.sender, Admin, Base_Fee_Buyer));

        return true;
    }

    // pay fair share to FRA agents
    function executeFRA(uint _fraID, address _buyer) public nonReentrant returns(bool) {
        
        // only called if Admin or Buyer - one buyer cannot execute other buyer's functions
        require(msg.sender == Admin || msg.sender == _buyer);
        // current time is greater or equal to the end FRA Maturity time - time sensitive
        require(now >= Forward_Rate_Agreements[_buyer][_fraID].End_Unix); // from a particular agreement (ID)
        // current time is less than the grace period
        require(now < Forward_Rate_Agreements[_buyer][_fraID].End_Cutoff_Unix);
        // require that the status of the FRA is active - to avoid multiple executions
        require(Forward_Rate_Agreements[_buyer][_fraID].Forward_State == State.Active);

        // Fee calculations
        uint Current_SF = realFee();
        uint FRA_Start_SF = Forward_Rate_Agreements[msg.sender][_fraID].Starting_Stability_fee;
        uint FRA_Notional = Forward_Rate_Agreements[msg.sender][_fraID].Notional;

        // Set the state of the FRA as executed - prevent it to be called again
        Forward_Rate_Agreements[msg.sender][_fraID].Forward_State = State.Executed;

        // If the differential is greater than zero then payout as profit, else payout normally (2 possible payouts)
        // 1. Max payout - will be the notional multiplied by the starting fee + coverage 
        // transfer payout to the buyer - buyer get paid full amount
        if (Current_SF >= Coverage + FRA_Start_SF) {
            uint Buyer_Pay = FRA_Notional.mul(FRA_Start_SF + Coverage).div(10**18);
            require(IERC20(Kovan_DAI).transfer(_buyer, Buyer_Pay));
        }

        // 2. Normal redistribution of the total amount to buyer and admin
        else {
            uint Total_Pay = FRA_Notional.mul(FRA_Start_SF + Coverage).div(10 ** 18);
            uint Buyer_Pay = FRA_Notional.mul(Current_SF).div(10 ** 18);
            uint Admin_Pay = Total_Pay.sub(Buyer_Pay);

            // transfer amount to buyer and admins (seller)
            require(IERC20(Kovan_DAI).transfer(_buyer, Buyer_Pay));
            require(IERC20(Kovan_DAI).transfer(Admin, Admin_Pay));
        }

        return true;
    }

    function triggerFRA(uint _fraID, address _buyer) public nonReentrant returns(bool) {
        // Could be called anywhere between the start and in Unix
        
        // only called if Admin or Buyer - one buyer cannot execute other buyer's functions
        require(msg.sender == Admin || msg.sender == _buyer);
        // current time is greater or equal to the end FRA Maturity time - time sensitive
        require(now >= Forward_Rate_Agreements[_buyer][_fraID].End_Unix); // from a particular agreement (ID)
        // require that the status of the FRA is active - to avoid multiple executions
        require(Forward_Rate_Agreements[_buyer][_fraID].Forward_State == State.Active);

        // Set the state of the FRA as executed - prevent it to be called again
        Forward_Rate_Agreements[msg.sender][_fraID].Forward_State = State.Triggered;

        // Fee calculations
        uint Current_SF = realFee();
        uint FRA_Start_SF = Forward_Rate_Agreements[msg.sender][_fraID].Starting_Stability_fee;
        uint FRA_Notional = Forward_Rate_Agreements[msg.sender][_fraID].Notional;

        // Check that the current stability fee is greater than the coverage + the Starting_Stability_fee
        // as long as this is true it is a max payout
        require(Current_SF >= Coverage + FRA_Start_SF);

        // Payout - pay the buyer the starting stability fee + coverage and transfer
        uint Buyer_Pay = FRA_Notional.mul(FRA_Start_SF + Coverage).div(10 ** 18);
        require(IERC20(Kovan_DAI).transfer(_buyer, Buyer_Pay));

        return true;
    }

    function expireFRA(uint _fraID, address _buyer) public nonReentrant returns(bool) {
        // only called if Admin or Buyer - one buyer cannot execute other buyer's functions
        require(msg.sender == Admin || msg.sender == _buyer);
        // current time is greater than the grace period
        require(now > Forward_Rate_Agreements[_buyer][_fraID].End_Cutoff_Unix);
        // require that the status of the FRA is active - to avoid multiple executions
        require(Forward_Rate_Agreements[_buyer][_fraID].Forward_State == State.Active);

        // Set the state of the FRA as expired
        Forward_Rate_Agreements[msg.sender][_fraID].Forward_State = State.Expired;

        // Fee calculations - base without real fee - from starting assumptions
        uint FRA_Start_SF = Forward_Rate_Agreements[msg.sender][_fraID].Starting_Stability_fee;
        uint FRA_Notional = Forward_Rate_Agreements[msg.sender][_fraID].Notional;

        // payout - returns everything to the initial state - buyer gets pays Starting_Stability_fee
        // admin is going to get coverage back
        uint Buyer_Pay = FRA_Notional.mul(FRA_Start_SF).div(10 ** 18);
        uint Admin_Pay = FRA_Notional.sub(Buyer_Pay);

        // transfer amount to buyer and admins (seller)
        require(IERC20(Kovan_DAI).transfer(_buyer, Buyer_Pay));
        require(IERC20(Kovan_DAI).transfer(Admin, Admin_Pay));

        return true;
    }

    // Helper for Front End

    function add(uint x, uint y) internal pure returns (uint z) {
        require((z = x + y) >= x, "ds-math-add-overflow");
    }
    function sub(uint x, uint y) internal pure returns (uint z) {
        require((z = x - y) <= x, "ds-math-sub-underflow");
    }
    function mul(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }

    function min(uint x, uint y) internal pure returns (uint z) {
        return x <= y ? x : y;
    }
    function max(uint x, uint y) internal pure returns (uint z) {
        return x >= y ? x : y;
    }
    function imin(int x, int y) internal pure returns (int z) {
        return x <= y ? x : y;
    }
    function imax(int x, int y) internal pure returns (int z) {
        return x >= y ? x : y;
    }

    uint constant WAD = 10 ** 18;
    uint constant RAY = 10 ** 27;

    //rounds to zero if x*y < WAD / 2
    function wmul(uint x, uint y) internal pure returns (uint z) {
        z = add(mul(x, y), WAD / 2) / WAD;
    }
    //rounds to zero if x*y < WAD / 2
    function rmul(uint x, uint y) internal pure returns (uint z) {
        z = add(mul(x, y), RAY / 2) / RAY;
    }
    //rounds to zero if x*y < WAD / 2
    function wdiv(uint x, uint y) internal pure returns (uint z) {
        z = add(mul(x, WAD), y / 2) / y;
    }
    //rounds to zero if x*y < RAY / 2
    function rdiv(uint x, uint y) internal pure returns (uint z) {
        z = add(mul(x, RAY), y / 2) / y;
    }
    function rpow(uint x, uint n) internal pure returns (uint z) {
        z = n % 2 != 0 ? x : RAY;

        for (n /= 2; n != 0; n /= 2) {
            x = rmul(x, x);

            if (n % 2 != 0) {
                z = rmul(z, x);
            }
        }
    }

    function realFee()  view public returns (uint z){
        uint Current_SF_Pre1 = DAI_Reference(Kovan_DAI).fee(); // just like for the interface
        // get fee value and the seconds in a year to exponentiate the fee per second in a year
        // compounding interest rate every second
        uint Current_SF_Pre2= rpow(Current_SF_Pre1, 31536000); 
        uint Current_SF = Current_SF_Pre2.sub(10** 27).div(10 ** 9); // returns a number with 18 decimals
        return Current_SF;
    }

    // when creating an FRA as a buyer this helps with statistics for the instrument before entering in

    // Base DAI for the buyer to be deposited in order to enter into a FRA
    function viewBDB( uint _notional ) view public returns (uint z){
        uint Current_SF = realFee();
        return _notional.mul(Current_SF).div(10 ** 18);
    }
    
    // Base Fee Buyer - that buyer has to pay to enter in a FRA
    function viewBFB( uint _notional, uint _months ) view public returns (uint z){
        
        return _notional.mul(Flat_Fee + Monthly_Fee * _months).div(10 ** 18);
    }

    // Base DAI that the admin has to put up
    function viewBDA(uint _notional) view public returns(uint z) {
        return _notional.mul(Coverage).div(10**18);
    }

}

interface IERC20 {
    function transfer(address, uint) external returns (bool);
    function transferFrom(address, address, uint) external returns (bool);
    function approve (address spender, uint tokens) external returns (bool success);
}

// we are using a contract to access the fee that is held in a different smart contract 
// this is how we will access the current stability fee
contract DAI_Reference {
    uint256 public fee;
}
