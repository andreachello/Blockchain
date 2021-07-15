const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

const provider = new HDWalletProvider(
    // mneumonic 
    '[ your 12 word mneumonic ]',
    // provider through infura
    'https://rinkeby.infura.io/v3/[ your infura node ]'
);

const web3 = new Web3(provider);

const deploy = async () => {
    // get list of all accounts that have been unlocked
    const accounts = await web3.eth.getAccounts();
    
    console.log("attempting to deploy from account", accounts[0])
    
    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode, arguments: ["Hi there!"]})
    .send({gas: '1000000', from:accounts[0]});
    
    console.log("Contract deployed to ", result.options.address);
};

deploy();