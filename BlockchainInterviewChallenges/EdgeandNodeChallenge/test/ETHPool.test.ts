import { expect } from 'chai'
import { ethers } from 'hardhat'
import '@nomiclabs/hardhat-ethers'
import { Contract } from "ethers";

describe("ETHPool", function() {
  
  // address initializations
  let owner, staker1, staker2;
  let ETHPool: Contract;

  // deploy contract before each test
  beforeEach(async function() {
    // get accounts for each address
    [owner, staker1, staker2] = await ethers.getSigners();

    // deploy the ETH Pool contract
    const contract = await ethers.getContractFactory("ETHPool");
    ETHPool = await contract.deploy();

    await ETHPool.deployed();
  });

  // Test 1. - Check if single address can deposit correctly
  it("Should allow single address to deposit", async function() {
    const amount = ethers.BigNumber.from("1000000000000000000"); // one Ether

    let transaction = {to: ETHPool.address, value: amount};

    await owner.sendTransaction(transaction);

    expect(await ETHPool.totalCurrentStake()).to.be.equal(amount);
  });

  // Test 2. - Check if multiple addresses can deposit correctly
  it("Should allow multiple addresses to deposit", async function() {
    const amount = ethers.BigNumber.from("1000000000000000000");
    let transaction = {to: ETHPool.address, value: amount};
    await owner.sendTransaction(transaction);
    await staker1.sendTransaction(transaction);
    await staker2.sendTransaction(transaction);
    
    expect(await ETHPool.totalCurrentStake()).to.be.equal(amount.mul(3));
  });

    // Test 3. - Check if single address can deposit multiple times
    it("Should allow single address to deposit multiple times", async function() {
      const amount = ethers.BigNumber.from("1000000000000000000");
      let transaction = {to: ETHPool.address, value: amount};

      await staker1.sendTransaction(transaction);
      await staker1.sendTransaction(transaction);
      
      expect(await ETHPool.totalCurrentStake()).to.be.equal(amount.mul(2));
    });

    // Test 4. - Return stake when rewards not distributed
    it("Should return stake when rewards not distributed", async function() {
      const balance = await staker1.getBalance();
      const amount = ethers.BigNumber.from("1000000000000000000");
      let transaction = {to: ETHPool.address, value: amount};

      await staker1.sendTransaction(transaction);

      await ETHPool.connect(staker1).withdraw();

      const newBalance = await staker1.getBalance();

      // we approximate the result due to loss of value given gas fees
      expect(newBalance).to.be.within(balance.sub(amount), balance);
    });

    // Test 5. - Rewards not distributed if there are no stakers
    it("Should not distribute rewards if there are no stakers", async function () {
      const amount = ethers.BigNumber.from("1000000000000000000");
  
      await expect(ETHPool.connect(owner).depositRewards({ value : amount })).to.be.reverted;
    });

    // Test 6. - Check staker A: 100ETH, staker B: 300ETH, Team T: 200ETH Scenario
    it("Should reward each staker proportional to their stake and return reward plus initial stake", async function () {
      const balance1 = await staker1.getBalance();
      const balance2 = await staker2.getBalance();
  
      const _100Eth = ethers.BigNumber.from("100000000000000000000");
      const _200Eth = ethers.BigNumber.from("200000000000000000000");
      const _300Eth = ethers.BigNumber.from("300000000000000000000");
  
      const _50Eth = ethers.BigNumber.from("50000000000000000000");
      const _150Eth = ethers.BigNumber.from("150000000000000000000");
      
      let transaction1 = {to: ETHPool.address, value: _100Eth};
      let transaction2 = {to: ETHPool.address, value: _300Eth};
    
      // A and B stake their ETH
      await staker1.sendTransaction(transaction1);
      await staker2.sendTransaction(transaction2);
  
      // Team deposits reward
      await ETHPool.connect(owner).depositRewards({ value : _200Eth });
  
      // A and B unstake 
      await ETHPool.connect(staker1).withdraw();
      await ETHPool.connect(staker2).withdraw();
  
      const newBalance1 = await staker1.getBalance();
      const newBalance2 = await staker2.getBalance();
      
      // stake + reward for each staker approx. due to gas fee imbalances
      expect(newBalance1).to.be.within(balance1, balance1.add(_50Eth)); 
      expect(newBalance2).to.be.within(balance2, balance2.add(_150Eth)); 
    });

    // Test 7. - Check for sequential withdrawl of rewards
    it("Should issue rewards for stakers in pool only", async function () {
      const balance1 = await staker1.getBalance();
      const balance2 = await staker2.getBalance();
  
      const _1ETH = ethers.BigNumber.from("1000000000000000000");
      const _100ETH = ethers.BigNumber.from("100000000000000000000");
      const _200ETH = ethers.BigNumber.from("200000000000000000000");
      const _300ETH = ethers.BigNumber.from("300000000000000000000");
      
      let transaction1 = {to: ETHPool.address,value: _100ETH};
      let transaction2 = {to: ETHPool.address,value: _300ETH};
    
      await staker1.sendTransaction(transaction1);
      await staker2.sendTransaction(transaction2);
  
      await ETHPool.connect(staker1).withdraw();
  
      await ETHPool.connect(owner).depositRewards({ value : _200ETH });
      
      await ETHPool.connect(staker2).withdraw();
  
      const newBalance1 = await staker1.getBalance();
      const newBalance2 = await staker2.getBalance();
      
      // assert that staker2 balance will change, staker1 will not change
      // we subtract 1 ETH to account for gas fees
      expect(newBalance1).to.be.within(balance1.sub(_1ETH), balance1); 
      expect(newBalance2).to.be.within(balance2, balance2.add(_200ETH)); 
    });
  
    //  Test 8. - Check that a single staker in the pool without any other stakers, received all rewards
    it("Should distribute rewards to single staker in pool", async function () {
      const balance1 = await staker1.getBalance();
  
      const _100ETH = ethers.BigNumber.from("100000000000000000000");
      const _200ETH = ethers.BigNumber.from("200000000000000000000");
      const _300ETH = ethers.BigNumber.from("300000000000000000000");
      
      let transaction1 = {to: ETHPool.address,value: _100ETH};
    
      // staker 1 deposits
      await staker1.sendTransaction(transaction1);
  
      // Team T deposits reward
      await ETHPool.connect(owner).depositRewards({ value : _200ETH });
      
      // staker 1 withdraws and collects 100% of rewards being the only staker in the pool
      await ETHPool.connect(staker1).withdraw();
  
      const newBalance1 = await staker1.getBalance();
      
      expect(newBalance1).to.be.within(balance1, balance1.add(_200ETH));
    });

    //  Test 9. - Check staker A, Team T, staker B Scenario
    it("Should distribe rewards only to stakers in the pool before the reward deposit", async function () {
      const balance1 = await staker1.getBalance();
      const balance2 = await staker2.getBalance();
  
      const _1ETH = ethers.BigNumber.from("1000000000000000000");
      const _100ETH = ethers.BigNumber.from("100000000000000000000");
      const _200ETH = ethers.BigNumber.from("200000000000000000000");
      const _300ETH = ethers.BigNumber.from("300000000000000000000");
      
      let transaction1 = {to: ETHPool.address,value: _100ETH};
      let transaction2 = {to: ETHPool.address,value: _300ETH};
    
      // staker 1 deposits
      await staker1.sendTransaction(transaction1);
  
      // Team T deposits
      await ETHPool.connect(owner).depositRewards({ value : _200ETH });
      
      // staker 1 withdraws and collects all rewards
      await ETHPool.connect(staker1).withdraw();

      // staker 2 deposits
      await staker2.sendTransaction(transaction2);

      // staker 2 withdraws and only gets back the amount deposited
      await ETHPool.connect(staker2).withdraw();

      const newBalance2 = await staker2.getBalance();
      
      expect(newBalance2).to.be.within(balance2.sub(_1ETH), balance2);
    });
})