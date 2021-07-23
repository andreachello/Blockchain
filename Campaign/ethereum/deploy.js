const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require('./build/CampaignFactory.json')

const provider = new HDWalletProvider(
    // mneumonic 
    '[MNEUMONIC]',
    // provider through infura
    'https://rinkeby.infura.io/v3/[NODE]'
);

const web3 = new Web3(provider);

const deploy = async () => {
    // get list of all accounts that have been unlocked
    const accounts = await web3.eth.getAccounts();
    
    console.log("attempting to deploy from account", accounts[0])
    
    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data: compiledFactory.bytecode})
    .send({gas: '1000000', from:accounts[0]});
    
    console.log("Contract deployed to ", result.options.address);
};

deploy();