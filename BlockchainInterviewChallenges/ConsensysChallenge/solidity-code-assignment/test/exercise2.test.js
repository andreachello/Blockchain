const SharesFund = artifacts.require("SharesFund");
const Hacker = artifacts.require("Hacker");
const truffleAssert = require('truffle-assertions');

contract("SharesFund", async accounts => {

  let sharesFund
  let hacker

  beforeEach(async () => {
    sharesFund = await SharesFund.new()
    hacker = await Hacker.new(sharesFund.address)
  })

  it("hacker cannot steal funds", async() => {
    await sharesFund.deposit({
      value: web3.utils.toWei('1', "gwei"),
      from: accounts[2]
    })
    await sharesFund.deposit({
      value: web3.utils.toWei('5', "gwei"),
      from: accounts[3]
    })
    await sharesFund.deposit({
      value: web3.utils.toWei('10', "gwei"),
      from: accounts[4]
    })

    await truffleAssert.fails(hacker.hack({
      value: web3.utils.toWei('1', "gwei"),
      gas: '6000000'
    }));

    const fundBalanceAfter = await web3.eth.getBalance(sharesFund.address)
    const sharesAccount2 = await sharesFund.shares(accounts[2])
    const sharesAccount3 = await sharesFund.shares(accounts[3])
    const sharesAccount4 = await sharesFund.shares(accounts[4])

    assert.equal(sharesAccount2, web3.utils.toWei('1', "gwei"))
    assert.equal(sharesAccount3, web3.utils.toWei('5', "gwei"))
    assert.equal(sharesAccount4, web3.utils.toWei('10', "gwei"))
    assert.equal(fundBalanceAfter, web3.utils.toWei('16', "gwei"))
  })

})
