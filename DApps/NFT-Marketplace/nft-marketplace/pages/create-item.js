import { useState} from 'react';
import { ethers } from 'ethers';
import {create as ipfsHttpClient} from 'ipfs-http-client';
import { useRouter } from 'next/router';
import Web3Model from "web3modal";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import {nftaddress, nftmarketaddress} from '../config';
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export default function CreateItem() {
    // create local state for user upload files and forms
    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({price: "", name: "", description: ""});

    // create a reference of the router
    const router = useRouter()

    // create and change input file handler
    async function onChange(event) {
        const file = event.target.files[0]
        // upload file to ipfs
        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                })
                //reference to added variable to set the url of where the file is located
                const url = `https://ipfs.infura.io/ipfs/${added.path}`
                setFileUrl(url)
        } catch (error) {
            console.log(error)
        }
    }

    // create file and upload a json representation of nft
    async function createMarket() {
        // need to get values from form input
        const { name, description, price} = formInput
        // check if values are available
        if (!name || !description || !price || !fileUrl) return
        // stringify the json data
        const data = JSON.stringify({
            name, description, image: fileUrl
        })

        try {
            const added = await client.add(data);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            // after file is uploaded to IPFS, pass the url to save it on the blockchain
            createSale(url)
        } catch(error) {
            console.log("Error uploading file: ", error)
        }

    }

    // listing item for sale (and creating nft)
    async function createSale(url) {
        const web3Model = new Web3Model()
        const connection = await web3Model.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const  signer = provider.getSigner()

        // interact with the nft contract by referencing the contract
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        // call create token on that contract and wait for transaction to be finised
        let transaction = await contract.createToken(url)
        let tx = await transaction.wait()

        // we get an events array back and within the array we get the args array which represents the id number
        // need to use toNumber() to transform the big number into an id number
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()
        // parse the price of the form as ether
        const price = ethers.utils.parseUnits(formInput.price, "ether")

        // move the reference of the contract from NFT to NFTMarket
        contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)

        // get listing price and turn into a string
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()
        
        // wait for contract create market item with all values to be executed
        transaction = await contract.createMarketItem(
            nftaddress, tokenId, price, { value: listingPrice}
            )
        await transaction.wait()

        // send user to homepage
        router.push("/")
    }

    return (
        <div className="flex justify-center">
            <div className="w-1/2 flex flex-col pb-12">
                <input 
                    placeholder="Asset Name"
                    className="mt-8 border rounded p-4"
                    onChange={event => updateFormInput({...formInput, name:event.target.value})} // only change the name
                />
                <textarea 
                    placeholder="Asset Description"
                    className="mt-2 border rounded p-4"
                    onChange={event => updateFormInput({...formInput, description:event.target.value})}
                />
                <input 
                    placeholder="Asset Price in Matic"
                    className="mt-2 border rounded p-4"
                    onChange={event => updateFormInput({...formInput, price:event.target.value})}
                />
                <input 
                    type="file"
                    name="Asset"
                    className="my-4"
                    onChange={onChange}
                />
                { // show preview of the file
                    fileUrl && (
                        <img className="rounded mt-4" width="350" src={fileUrl} />
                    )
                }
                <button onClick={createMarket} className="font-bald mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                    Create Digital Asset
                </button>
            </div>
        </div>
    )
}