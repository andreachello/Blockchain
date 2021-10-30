const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require('web3');
const { interface, bytecode } = require("../compile")
const INITIAL_STRING = "Hi there!"

// create an instance of Web3 and tell it to connect to a provider
const web3 = new Web3(ganache.provider());

let accounts;
let inbox;

beforeEach(async() => {
    // get a list of all accounts, awaits for the list of accounts and assign it to the accounts var
    // this is async in nature therefore requiring the async keyword
    accounts = await web3.eth.getAccounts();

    // use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data:bytecode, arguments: [INITIAL_STRING]})
    .send({from:accounts[0], gas:"1000000"})

});

describe ("Inbox", () => {
    it("deploys a contract", () => {
        // if there is an address the contract is propably deployed, ok means that it is not undefined
        assert.ok(inbox.options.address);
    });

    it("has a default message", async() => {
        const message = await inbox.methods.message().call();
        assert(message, INITIAL_STRING);
    });

    it("sets a message", async() => {
        // if transaction works successfully it will not throw an error
        await inbox.methods.setMessage("bye").send({from:accounts[0]})
        const message = await inbox.methods.message().call();
        assert(message, 'bye');

    });

});