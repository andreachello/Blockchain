import { useEffect, useState} from 'react';
import { ethers } from 'ethers';
import axios from "axios";
import Web3Model from "web3modal";

import {nftaddress, nftmarketaddress} from '../config';
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export default function MyAssets() {
    // local state
    const [nfts, setNfts] = useState([]);
    const[loadingState, setLoadingState] = useState("not-loaded");

    // load nfts
    useEffect(() => {
        loadNfts()
    }, [])
    async function loadNfts() {
        const web3Model = new Web3Model()
        const connection = await web3Model.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        // need the signer to know who the sender is
        const signer = provider.getSigner()

        // take a reference to nft contract and market contract as we need to map over market items to get token uris
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)
    
        // get the data
        const data = await marketContract.fetchMyNFTs()
    
        // map over all of the items in data
        const items = await Promise.all(data.map(async i => {
            // cal token contract and get token uri
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            // need metadata fro IPFS
            const meta = await axios.get(tokenUri)
    
            // get price and represent nft as an item
            let price = ethers.utils.formatUnits(i.price.toString(), "ether")
            let item = {
              price, 
              tokenId: i.tokenId.toNumber(),
              seller: i.seller,
              owner: i.owner,
              image: meta.data.image,
              name: meta.data.name,
              description: meta.data.description, 
            }
            return item
        }))
        // set new items array
        setNfts(items);
        setLoadingState('loaded')
      }

      // if purshased no nfts
      if (loadingState === "loaded" && !nfts.length) return (
          <h1 className="py-10 px-20 text-3xl">No Assets Owned</h1>
      )

      return (
        <div className="flax justify-center">
        <div className="px-4" style={{ maxWidth: '1600px'}}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {
                nfts.map((nft, index) => (
                  <div key={index} className="border shadow rounded-xl overflow-hidden">
                    <img src={nft.image}/>
                    <div className="p-4 bg-black">
                        <p className="text-2xl font-bold text-white">Price = {nft.price} Eth</p>
                    </div>
                  </div>
                ))
              }
            </div>
        </div>
      </div>
      )
}