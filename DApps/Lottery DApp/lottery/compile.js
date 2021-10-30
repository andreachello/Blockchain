const path = require('path');
const fs = require('fs');
const solc = require('solc');

// generate path to inbox file
const lotteryPath = path.resolve(__dirname, 'contracts', "Lottery.sol");

// use file system module to run the solidity scripts
const source = fs.readFileSync(lotteryPath, "utf8")
// compile number of solidity files
module.exports = solc.compile(source, 1).contracts[":Lottery"];