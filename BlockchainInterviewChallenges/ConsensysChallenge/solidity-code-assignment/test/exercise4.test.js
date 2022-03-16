const Facade = artifacts.require("Facade");
const Storage = artifacts.require("Storage");

contract("Facade", async accounts => {

  let facade

  beforeEach(async () => {
    facade = await Facade.new()
  })

  it('must return correct value', async() => {
    const receipt = await web3.eth.sendTransaction({
      data: "0x60806040526040518060400160405280600c81526020017f696e697469616c697365643100000000000000000000000000000000000000008152506000908051906020019061004f9291906100ae565b506040518060400160405280600c81526020017f696e697469616c697365643200000000000000000000000000000000000000008152506001908051906020019061009b9291906100ae565b503480156100a857600080fd5b506101b2565b8280546100ba90610151565b90600052602060002090601f0160209004810192826100dc5760008555610123565b82601f106100f557805160ff1916838001178555610123565b82800160010185558215610123579182015b82811115610122578251825591602001919060010190610107565b5b5090506101309190610134565b5090565b5b8082111561014d576000816000905550600101610135565b5090565b6000600282049050600182168061016957607f821691505b6020821081141561017d5761017c610183565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b610537806101c16000396000f3fe608060405234801561001057600080fd5b50600436106100455760003560e01c80633a4ddff214610094578063adc3034b146100b0578063ef738a56146100cc57610046565b5b6040518060400160405280600481526020017f6e6f706500000000000000000000000000000000000000000000000000000000815250600090805190602001906100919291906101b0565b50005b6100ae60048036038101906100a991906102c3565b6100ea565b005b6100ca60048036038101906100c591906102c3565b610104565b005b6100d461011e565b6040516100e19190610345565b60405180910390f35b80600090805190602001906101009291906101b0565b5050565b806001908051906020019061011a9291906101b0565b5050565b60606000805461012d9061041b565b80601f01602080910402602001604051908101604052809291908181526020018280546101599061041b565b80156101a65780601f1061017b576101008083540402835291602001916101a6565b820191906000526020600020905b81548152906001019060200180831161018957829003601f168201915b5050505050905090565b8280546101bc9061041b565b90600052602060002090601f0160209004810192826101de5760008555610225565b82601f106101f757805160ff1916838001178555610225565b82800160010185558215610225579182015b82811115610224578251825591602001919060010190610209565b5b5090506102329190610236565b5090565b5b8082111561024f576000816000905550600101610237565b5090565b60006102666102618461038c565b610367565b905082815260208101848484011115610282576102816104e1565b5b61028d8482856103d9565b509392505050565b600082601f8301126102aa576102a96104dc565b5b81356102ba848260208601610253565b91505092915050565b6000602082840312156102d9576102d86104eb565b5b600082013567ffffffffffffffff8111156102f7576102f66104e6565b5b61030384828501610295565b91505092915050565b6000610317826103bd565b61032181856103c8565b93506103318185602086016103e8565b61033a816104f0565b840191505092915050565b6000602082019050818103600083015261035f818461030c565b905092915050565b6000610371610382565b905061037d828261044d565b919050565b6000604051905090565b600067ffffffffffffffff8211156103a7576103a66104ad565b5b6103b0826104f0565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b82818337600083830152505050565b60005b838110156104065780820151818401526020810190506103eb565b83811115610415576000848401525b50505050565b6000600282049050600182168061043357607f821691505b602082108114156104475761044661047e565b5b50919050565b610456826104f0565b810181811067ffffffffffffffff82111715610475576104746104ad565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f830116905091905056fea264697066735822122015c1e99e13b1795a8837504128ec81c7bf15812c0ffcd6caa89099cf1162135e64736f6c63430008070033",
      from: accounts[0],
      gasLimit: 6000000
    })

    const storageAddress = receipt.contractAddress;
    console.log(receipt.var2)
    const storage = await Storage.at(storageAddress)
    
    await facade.set(storageAddress, "works!")

    const works = await storage.getSentence()
    assert.equal(works, "works!")
  })

})
