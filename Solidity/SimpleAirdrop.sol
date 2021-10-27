pragma solidity >= 0.7.0 < 0.9.0;

/*

Incentive staking more by airdropping more if the stake is higher

*/

contract SimpleAirdrop {
   
   uint stakingWallet = 10;

    function Airdrop() public view returns(uint) {
        if (stakingWallet >= 10) {
            return stakingWallet + 10;
        } else {
            return stakingWallet + 1;
        }
        
        
    }   
}
