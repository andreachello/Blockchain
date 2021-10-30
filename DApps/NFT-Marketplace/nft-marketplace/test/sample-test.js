const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
      // deploy NFT Marketplace
      const Market = await ethers.getContractFactory("NFTMarket")
      const market = await Market.deploy()
      await market.deployed()

      // get creator of marketplace
      const marketAddress = market.address

      // Deploy NFT using deployer's address by deploying the NFT contract
      const NFT = await ethers.getContractFactory("NFT")
      const nft = await NFT.deploy(marketAddress)
      await nft.deployed()
      const nftContractAddress = nft.address

      // listing price
      let listingPrice = await market.getListingPrice()
      listingPrice = listingPrice.toString()

      // get auction price
      const auctionPrice = ethers.utils.parseUnits('1', 'ether')

      // create tokens
      await nft.createToken("https://www.mytokenlocation.com")
      await nft.createToken("https://www.mytokenlocation2.com")

      // list tokens on market
      await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice })
      await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice })

      // get test addresses (underscore is to ignore the first address (as the seller is the _))
      const [_, buyerAddress] = await ethers.getSigners()

      // use the buyer address to buy
      await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice})

      let items = await market.fetchMarketItems()

      items = await Promise.all(items.map(async i => {
        const tokenUri = await nft.tokenURI(i.tokenId)
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri
        }
        return item
      }))

      console.log('items: ', items)

  });
});
