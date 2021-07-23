import Web3 from 'web3';

const accessToken = process.env.INFURA_ACCESS_TOKEN;

let web3;

// see if we are running this code in the browser (typeof looks at if the window is not undefined)
// and if browser already has metamask

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {

// We are in the browser and metamask is running.

web3 = new Web3(window.web3.currentProvider);

} else {

// We are on the server(SSR) *OR* the user is not running metamask (USE OUR OWN PROVIDER)

const provider = new Web3.providers.HttpProvider(

"https://rinkeby.infura.io/v3/5213390a5aed428dbb5f48af0db555df"

);

web3 = new Web3(provider);

}



export default web3;