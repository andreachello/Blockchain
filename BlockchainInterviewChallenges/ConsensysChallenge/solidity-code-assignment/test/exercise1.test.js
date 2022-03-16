const SimpleToken = artifacts.require("SimpleToken");

contract("SimpleToken", async accounts => {

  let simpleToken

  beforeEach(async () => {
    simpleToken = await SimpleToken.new()
  })

  it("can mint and balance is updated", async() => {
    await simpleToken.mint(accounts[1], 1000)
    const balanceAcc1 = await simpleToken.balanceOf(accounts[1])
    assert.equal(balanceAcc1, 1000)
  })

  it("multiple calls to mint - gas costs under X", async() => {
    for(let i = 0; i < 100; i++) {
      const hash = web3.utils.soliditySha3(i)
      const address = hash.substring(0, 42)
      const receipt = await simpleToken.mint(address, 1000)
      const balance = await simpleToken.balanceOf(address)
      assert.equal(balance, 1000)
      assert.isTrue(receipt.receipt.gasUsed < 100000)
    }
  })

})
