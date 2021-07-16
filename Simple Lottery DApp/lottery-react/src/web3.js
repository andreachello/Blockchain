import Web3 from "web3";

// remove metamask provider and use our own web3 provider

window.ethereum.request({ method: "eth_requestAccounts" });
 
const web3 = new Web3(window.ethereum);
 
export default web3;