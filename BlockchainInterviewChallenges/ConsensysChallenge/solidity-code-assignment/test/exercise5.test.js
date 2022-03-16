const PriceOracle = artifacts.require("PriceOracle");
const PriceOracleV2 = artifacts.require("PriceOracleV2");
const PriceOracleV3 = artifacts.require("PriceOracleV3");
const OracleProxy = artifacts.require("OracleProxy");
const truffleAssert = require('truffle-assertions');

contract("Oracle", async accounts => {

  let oracleProxy
  let oracleImplv1
  let oracleImplv2
  let oracleImplv3

  const owner = accounts[0]
  const operator = accounts[1]
  const nobody = accounts[2]

  beforeEach(async () => {
    oracleImplv1 = await PriceOracle.new()
    oracleImplv2 = await PriceOracleV2.new()
    oracleImplv3 = await PriceOracleV3.new()
  })

  it('oracle v1 deployment works - owner is set once', async() => {
    oracleProxy = await OracleProxy.new(0x473be604, oracleImplv1.address)
    // done to be able to call implementation functions from the proxy address
    const proxy = await PriceOracle.at(oracleProxy.address)

    const proxyOwner = await proxy.owner()

    await truffleAssert.reverts(proxy.constructor1(), "Already initalized")
    assert.equal(proxyOwner, owner)
  })

  it("only operator can update price in V1", async() => {
    oracleProxy = await OracleProxy.new(0x473be604, oracleImplv1.address)
    const proxy = await PriceOracle.at(oracleProxy.address)

    await proxy.setOperator(operator, {
      from: owner
    })

    await proxy.setPrice(1234, {
      from: operator
    })

    const newPrice = await proxy.price()

    await truffleAssert.reverts(
      proxy.setPrice(1234, {
        from: owner
      }),
      "Only operator is allowed to perform this action"
    )
    await truffleAssert.reverts(
      proxy.setPrice(1234, {
        from: nobody
      }),
      "Only operator is allowed to perform this action"
    )

    assert.equal(newPrice, 1234)
  })

  it("owner can upgrade proxy implementation - twice", async() => {
    oracleProxy = await OracleProxy.new(0x473be604, oracleImplv1.address)
    let proxy = await PriceOracle.at(oracleProxy.address)
    await proxy.setOperator(operator, {
      from: owner
    })
    // we update proxy implementation to V2
    await proxy.updateCode(oracleImplv2.address)
    proxy = await PriceOracleV2.at(oracleProxy.address)

    await proxy.updateCode(oracleImplv3.address)

  })

})
