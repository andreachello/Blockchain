const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json")
const compiledCampaign = require("../ethereum/build/Campaign.json")

// start tests

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    // get local testing accounts
    accounts = await web3.eth.getAccounts();

    // deploy the factory method from the first account and assign the contract to a new variable
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data: compiledFactory.bytecode})
    .send({from: accounts[0], gas:"1000000"})

    // create a new campaign using an addresss
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas:"1000000"
    });

    // insert the campaign address inside the campaignAddress array
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    // we only have to specify the address of the new campaign and not redeploy the contract
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface), campaignAddress
    );
});

describe("Campaigns", () => {
    it("Deploys a factory and campaign", () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    // mark accounts[0] is marked as manager
    it("Marks caller as the campaign manager", async () => {
        const manager = await campaign.methods.manager().call();
        assert(accounts[0], manager);
    });

    // Test if people can contribute
    it("Allows people to contribute money and marks them as approvers", async() => {
        await campaign.methods.contribute().send({
            value: "200",
            from: accounts[1]
        });

        const isContributer = await campaign.methods.approvers(accounts[1]).call();

        assert(isContributer);
    });

    // test for min contr
    it("requires a minimum contribution", async () => {
        try {
            await compaign.contribute.send({
                value:5,
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err)
        }
    });

    // payment request
    it('allows a manager to make a payment request', async () => {
        await campaign.methods.createRequest(
            'buy batteries', '100', accounts[1]
        ).send({
            from: accounts[0],
            gas: "1000000"
        })
        
        const request = await campaign.methods.requests(0).call();

        assert("buy batteries", request.description);

    });

    // end to end process request
    it("processes requests", async() => {

        // contribute to campaign
        await campaign.methods.contribute().send({
            from:accounts[0],
            value: web3.utils.toWei("10", "ether")
        })

        // manager creates a payment request
        await campaign.methods.createRequest(
            'buy batteries', web3.utils.toWei("5", "ether"), accounts[1]
        ).send({
            from: accounts[0],
            gas: "1000000"
        });

        // contributors vote (in this case there is only one)
        await campaign.methods.approveRequest(0).send({
            from:accounts[0],
            gas: '1000000'
        });

        // finalize request
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: "1000000"
        });

        // retrieve balance of accounts 1 - balance is a string that represents the amount of balance acc1 has in wei
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, "ether");
        balance = parseFloat(balance);

        assert(balance > 104)
    });
});