const {ethers} = require("hardhat")

module.exports = async({ getNamedAccounts, deployments }) => {
    const {deploy} = deployments
    const {deployer} = await getNamedAccounts()

    const rewardToken = await ethers.getContract("RewardToken")
    const stakingToken = await ethers.getContract("StakingToken")

    const stakingDeployment = await deploy("Staking", {
        from: deployer,
        args: [stakingToken.address, rewardToken.address],
        log: true
    })
}

module.exports.tags = ["all", "staking"]