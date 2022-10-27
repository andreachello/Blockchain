module.exports = async({ getNamedAccounts, deployments }) => {
    const {deploy} = deployments
    const {deployer} = await getNamedAccounts()

    const stakingToken = await deploy("StakingToken", {
        from: deployer,
        args: [],
        log: true,
    })
}

module.exports.tags = ["all", "stakingToken"]