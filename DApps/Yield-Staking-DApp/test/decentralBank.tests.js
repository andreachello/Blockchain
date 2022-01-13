const Tether = artifacts.require('Tether');
const Reward = artifacts.require('Reward');
const DecentralBank = artifacts.require('DecentralBank');

const tetherName = "Mock Tether Token"
const rewardtoken = "Reward Token"

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, customer]) => {

    let tether, rwd, decentralBank;

    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    }

    before(async () => {
        // Load contracts
        tether = await Tether.new()
        rwd = await Reward.new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)

        // check transfer of all reward tokens to decentralized bank
        await rwd.transfer(decentralBank.address, tokens('1000000'))
        
        // check the initial mock token drop to the investor
        await tether.transfer(customer, tokens('100'), {from: owner})

    })
    
    // Succesful name matching
    describe('Mock Tether Deployment', async() => {
        it('Matches name successfully', async() => {
            const name = await tether.name()
            assert.equal(name,tetherName)
        })
    })

    describe('Reward Token Deployment', async() => {
        it('Matches name successfully', async() => {
            const name = await rwd.name()
            assert.equal(name, rewardtoken)
        })
    })

    describe('Decentral Bank Deployment', async() => {
        it('Matches name successfully', async() => {
            const name = await decentralBank.name()
            assert.equal(name, 'Decentral Bank')
        })

        it('contract has tokens', async() => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('1000000'))
        })
    })

    // check initial balance
    describe('Yield Farming', async () => {
        it('rewards tokens for staking', async () => {
            let result;

            // check investor balance
            result = await tether.balanceOf(customer);

            // we have 100 tokens automatically given
            assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance before staking')
        
            // check depositing of staking
            await tether.approve(decentralBank.address, tokens('100'), {from:customer})
            await decentralBank.depositTokens(tokens('100'), {from:customer})

            // check updated balance of customer
            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), tokens('0'), 'customer mock wallet balance after staking')

            // check updated balance of bank
            result = await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(), tokens('100'), "decentral bank mock wallet after staking from customer")
        
            // Is Staking update
            result = await decentralBank.isStaking(customer)
            assert.equal(result.toString(), 'true', 'customer staking status after depositing')

            // Check issue tokens
            await decentralBank.issueTokens({from:owner})

            // Ensure only owner can issue tokens
            await decentralBank.issueTokens({from:customer}).should.be.rejected;

            // unstaking tests
            await decentralBank.unstakeTokens({from:customer})

            // check unstaking balances
             result = await tether.balanceOf(customer);
             assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance after unstaking')
 
             // check updated balance of bank
             result = await tether.balanceOf(decentralBank.address)
             assert.equal(result.toString(), tokens('0'), "decentral bank mock wallet after unstaking from customer")

            // Is Staking update
            result = await decentralBank.isStaking(customer)
            assert.equal(result.toString(), 'false', 'customer staking status after unstaking')




        
    })
})



})