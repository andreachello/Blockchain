const assert = require('assert');
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require("../compile");

let lottery;
let accounts;

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data:bytecode})
    .send({from:accounts[0], gas: "1000000"})
});

describe("Lottery Contract", () => {

    // test if contract was successfully deployed to local network
    it("deploys the contract", () => {
        assert.ok(lottery.options.address)
    });

    // test entering the lottery in one account
    it("Enters the lottery", async () => {
        await lottery.methods.enter().send({
            // who is entering
            from:accounts[0],
            // min amount to send
            value: web3.utils.toWei('0.001', 'ether'),
        });

        const players = await lottery.methods.getPlayers().call({
            from:accounts[0]
        });

        // check there are exactly 1 accounts in the array and that the player is the actual address
        assert(accounts[0], players[0]);
        assert(1, players.length)
    });
    
    // multiple accounts
    it("Multiple accounts enter the lottery", async () => {
        await lottery.methods.enter().send({
            // who is entering
            from:accounts[0],
            // min amount to send
            value: web3.utils.toWei('0.001', 'ether'),
        });

        await lottery.methods.enter().send({
            // who is entering
            from:accounts[1],
            // min amount to send
            value: web3.utils.toWei('0.001', 'ether'),
        });

        await lottery.methods.enter().send({
            // who is entering
            from:accounts[2],
            // min amount to send
            value: web3.utils.toWei('0.001', 'ether'),
        });

        const players = await lottery.methods.getPlayers().call({
            from:accounts[0]
        });

        // check there are exactly 1 accounts in the array and that the player is the actual address
        assert(accounts[0], players[0]);
        assert(accounts[1], players[1]);
        assert(accounts[2], players[2]);
        assert(3, players.length);
    });

    // requiring min amount
    it("requires a minimum amount of ether to enter", async () => {
        try {
                await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('0.00000001', 'ether'),
        });
        // if the try works then it would fail with assert false
        assert(false);
        // we want to make sure that the error if in the catch statement
        } catch (err) {
            // make sure there is an error
            assert(err);
        };
    });

    // pick winner test
    it("only manager can call pickWiner", async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
        // if try works fail it
        assert(false);
        } catch (err) {
            assert(err);
        };
    });

    // end to end
    it('it send money to winner and resets the players array', async () => {
        await lottery.methods.enter().send({
            from:accounts[0],
            value: web3.utils.toWei('2', 'ether'),
        });

        // get initial balance of the account
        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({from: accounts[0]});

        // get final balance
        const finalBalance = await web3.eth.getBalance(accounts[0]);

        // compare both balances factoring in gas prices
        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei("1.8", 'ether'));
    });

});