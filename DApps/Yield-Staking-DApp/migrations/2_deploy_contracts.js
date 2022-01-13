const Tether = artifacts.require('Tether');
const Reward = artifacts.require('Reward');
const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function(deployer, network, accounts) {

    // Wiring all smart contracts

    await deployer.deploy(Tether)
    const tether = await Tether.deployed()
    
    await deployer.deploy(Reward)
    const rwd = await Reward.deployed()

    await deployer.deploy(DecentralBank, rwd.address, tether.address)
    const decentralBank = await DecentralBank.deployed()
    
    // transfer all reward tokens to the bank
    await rwd.transfer(decentralBank.address, "1000000000000000000000000")

    // distribute 100 tether tokens automatically when entering DApp
    await tether.transfer(accounts[1], '100000000000000000000')
};