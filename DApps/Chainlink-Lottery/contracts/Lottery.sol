// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
import "@chainlink/contracts/src/v0.6/vendor/SafeMathChainlink.sol";

contract Lottery is VRFConsumerBase{
    using SafeMathChainlink for uint256;

    // Ownable functionlity
    address private _owner;

    // states of lottery - Open: Lottery is open to players, closed: lottery is closed
    // Calculating: lottery is calculating winner so it is closed to new entrants
    enum LOTTERY_STATE {OPEN, CLOSED, CALCULATING_WINNER}
    // state variable for the enum
    LOTTERY_STATE public lotteryState;

    // our price feed from the chainlink oracle interface
    AggregatorV3Interface internal ethUsdPriceFeed;
    uint256 public usdEntryFee;
    // recent winner
    address public recentWinner;
    // randomness variables
    uint256 public randomness;
    // fee
    uint256 public fee;
    // key hash
    bytes32 public keyHash;
    // array of players (type address payable)
    address payable[] public players;

    // events - get correct request id
    event RequestedRandomness(bytes32 requestId);

    // set the feed to the required address of the price feed
    // this will make our contract network agnostic and allow us to run different
    // tests on different price feeds
    // need the VRF consumer base
    constructor(address _ethUsdPriceFeed, address _vrfCoordinator, address _link, bytes32 _keyHash) 
        VRFConsumerBase(
            _vrfCoordinator,
            _link
        )
        public {
        
        ethUsdPriceFeed = AggregatorV3Interface(_ethUsdPriceFeed);
        usdEntryFee = 50;
        // Default state is closed once deployed
        lotteryState = LOTTERY_STATE.CLOSED;
        // set owner
        _owner = msg.sender;
        // set fee
        fee = 100000000000000000; // 0.1 LINK
        // set key hash
        keyHash = _keyHash;
    }

    // onlyOwner modifier
    modifier onlyOwner {
        require(msg.sender == _owner, "Only the owner can execute this function");
        _;
    }

    // users pay the USD equivalent of ETH to enter the lottery
    function enter() public payable {
        // A player submits their fee which is going to be greater than the entrance fee
        // ETH equivalent of X USD
        require(msg.value>=getEntranceFee(), "Not enough ETH to enter");
        // require the lottery to be open
        require(lotteryState == LOTTERY_STATE.OPEN, "Lottery is not open");
        // add player to player array
        players.push(msg.sender);
    }

    function getEntranceFee() public view returns(uint256) {
        uint256 precision = 1 * 10 ** 18;
        uint256 price = getLatestEthUsdPrice(); // 8 decimals
        // divide precision expressed in wei (18 decimals) by the price
        // and multiply by the cost in dollars and multiple by the rest of 
        // the precision
        uint256 costToEnter = (precision / price) * (usdEntryFee * 100000000);
        return costToEnter;
    }

    function getLatestEthUsdPrice() public view returns(uint256) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answerInRound
        ) = ethUsdPriceFeed.latestRoundData();
        return uint256(price);
    }

    // only want the owner to start the lottery
    function startLottery() public onlyOwner {
        // require that the state of the lottery is closed
        require(lotteryState == LOTTERY_STATE.CLOSED, "Can't start a new lottery");
        // open the lottery
        lotteryState = LOTTERY_STATE.OPEN;
        // set the randomness variable
        randomness = 0;
    }

    // get a provable random number from the oracle so we can end the lottery
    function endLottery() public onlyOwner {
        // lottery must be open
        require(lotteryState == LOTTERY_STATE.OPEN, "Cannot end lottery");
        // set lottery state to calculating winner
        lotteryState = LOTTERY_STATE.CALCULATING_WINNER;
        // call the pickWinner function
        pickWinner();
    }

    function pickWinner() private returns(bytes32){
        require(lotteryState == LOTTERY_STATE.CALCULATING_WINNER, "Needs to be calculating winner");
        // add request randomness function from the VRF Function from Chainlink
        bytes32 requestId = requestRandomness(keyHash, fee);
        emit RequestedRandomness(requestId);
    }

    // send out request to the Chainlink VRF and it will be returned through this function
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        require(randomness > 0, "random number not found");
        // pick random winner - get the remainder of the random number divided by the 
        // length of the players
        uint256 index = randomness % players.length;
        // send the winner all the ETH in the contract
        players[index].transfer(address(this).balance);
        // set the recent winner to the winner picked
        recentWinner = players[index];
        // reset the player array  - of length zero
        players = new address payable[](0);
        // reset lottery state to closed
        lotteryState = LOTTERY_STATE.CLOSED;
        // set the random number
        randomness = randomness;
    }
}