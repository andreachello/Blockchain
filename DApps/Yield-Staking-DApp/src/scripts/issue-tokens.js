const DecentralBank = artifacts.require('DecentralBank')

module.exports = async function issueRewards() {
    let decentralBank = await DecentralBank.deployed()
    await decentralBank.issueTokens()
    console.log('Tokens successfully issued')
    callback()
}