import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

// to get access to the deployed contract
const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    "[contract address copied from console.log when deploying solidity contract]"
);

export default instance;