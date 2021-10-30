import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

// to get access to the deployed contract
const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    "0x4defc22B38F29E694fccc080B5315abC561dbbB9"
);

export default instance;