const Vault = artifacts.require("Vault");
const VaultFactory = artifacts.require("VaultFactory");
const truffleAssert = require('truffle-assertions');

contract("Vault", async accounts => {

  let vault
  let vaultFactory

  beforeEach(async () => {
    vault = await Vault.new()
    vaultFactory = await VaultFactory.new(web3.utils.toWei('10', "gwei"))
  })

  it('can deposit max vault capacity', async() => {
    await vaultFactory.initVault(vault.address, {
      value: web3.utils.toWei('10', "gwei")
    });

    const balance = await web3.eth.getBalance(vault.address)
    assert.equal(balance, web3.utils.toWei('10', "gwei"))
  })

  it('can not deposit more than max vault capacity', async() => {
    
    await truffleAssert.fails(vaultFactory.initVault(vault.address, {
      value: web3.utils.toWei('100', "gwei")
    }));

    const balance = await web3.eth.getBalance(vault.address)
    assert.equal(balance, 0)
  })

})
