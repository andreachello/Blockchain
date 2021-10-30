require("@nomiclabs/hardhat-waffle");

const fs = require("fs");

const privateKet = fs.readFileSync(".secret").toString()

const projectId = "84a96a3f4e3040b0a71a510bbd586147";


module.exports = {
  networks: {
    hardhat: {
      chainId:1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [privateKet]
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts: [privateKet]
    }

  },
  solidity: "0.8.4",
};
