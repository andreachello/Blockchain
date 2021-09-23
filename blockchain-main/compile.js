/*const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxpath = path.resolve(__dirname, 'contracts', 'inbox.sol');
const source = fs.readFileSync(inboxpath, 'UTF-8');
module.exports = solc.compile(source,1).contracts[':inbox']*/

const path = require('path');
const fs = require('fs');
const solc = require('solc');

// generate path to inbox file
const inboxPath = path.resolve(__dirname, 'contracts', "inbox.sol");

// use file system module to run the solidity scripts
const source = fs.readFileSync(inboxPath, "utf8")
// compile number of solidity files
module.exports = solc.compile(source, 1).contracts[":Inbox"];
//console.log(solc.compile(source, 1));