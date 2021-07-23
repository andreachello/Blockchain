const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

// delete build folder if it exists
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

// read campaign.sol file
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

// compile everything in the file
const output = solc.compile(source, 1).contracts;

// create build path
fs.ensureDirSync(buildPath);

// loop over output object and take each contract that exists inside of it and write it to a different file inside the build dir
for (let contract in output) {
    fs.outputJSONSync(
        // build path onto which we want to save this contract in
        path.resolve(buildPath, contract.replace(":", "") + ".json"),
        // contents we want to write
        output[contract]
    );
}