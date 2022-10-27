const { expect } = require("chai")
const { ethers, deployments } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")
const { moveTime } = require("../utils/move-time")

const SECONDS_IN_A_DAY = 86400

describe("Staking Test", async () => {
    let staking, rewardToken, stakingToken, deployer, stakeAmount, startingRewardBalance

    beforeEach(async () => {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        await deployments.fixture(["all"])
        staking = await ethers.getContract("Staking")
        stakingToken = await ethers.getContract("StakingToken")
        rewardToken = await ethers.getContract("RewardToken")
        stakeAmount = ethers.utils.parseEther("1000000")
        rewardAmount = ethers.utils.parseEther("100000")

        startingRewardBalance = await rewardToken.balanceOf(deployer.address)
        await rewardToken.transfer(staking.address, rewardAmount)

        await staking.setRewardsDuration(SECONDS_IN_A_DAY)
        await staking.notifyRewardAmount(rewardAmount)
        
    })

    it("Display correct balances for deployer", async () => {
        const rewardBalance = await rewardToken.balanceOf(deployer.address)
        const contractRewardsBalance = await rewardToken.balanceOf(staking.address)
        expect(parseInt(ethers.utils.formatEther(rewardBalance))).to.equal(ethers.utils.formatEther(startingRewardBalance) - ethers.utils.formatEther(rewardAmount))
        expect(ethers.utils.formatEther(contractRewardsBalance)).to.equal(ethers.utils.formatEther(rewardAmount))
    })

    it("Allows users to stake and claim rewards", async () => {
        await stakingToken.approve(staking.address, stakeAmount)
        await staking.stake(stakeAmount)
        const startingEarned = await staking.earned(deployer.address)
        console.log(`Starting Earned: ${startingEarned}`);

        // move time
        await moveTime(SECONDS_IN_A_DAY)
        await moveBlocks(1)

        const endingEarned = await staking.earned(deployer.address)
        console.log(`Ending Earned: ${endingEarned}`);
    })
})