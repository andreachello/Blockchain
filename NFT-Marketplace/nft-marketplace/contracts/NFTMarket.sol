// SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.4;

// utility for incrementing numbers 
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// Security mechanism called non-re-entrant to protect certain transactions that are actually talkingh to a separate
// contract to prevent someone from hitting this with multiple transactions (prevents re-entry attacks)
// use this on any function that talks to other contracts
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold; // because we cannot work with dynamic arrays in sol

    // numbers needed: num of items that I bought myself, created myself, currently not sold
    //owner of the contract (charge a listing fee)
    address payable owner;
    uint256 listingPrice = 0.025 ether;

    constructor() {
        //owner of the contract is the one deploying it
        owner = payable(msg.sender);
    }

    // struct for each individual market item
    struct MarketItem {
        uint itemId;
        address nftContract; //contract address
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    // start keeping up with all items created
    // mapping passes in a uint which is the itemId and it returns the MarketItem
    mapping(uint256 => MarketItem) private idToMarketItem;

    // have an event for when a market item is created and it is going to match the marketitem
    // done to listen to events in a front end app
    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    // function that returns the listing price (for the front end)
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    // function to create a market item
    function createMarketItem (
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "price must be at least 1 wei");
        // require that the person is sending in listing price as long with transaction
        require(msg.value == listingPrice, "Price must be equal to listing price");

        // increment item ids and create item id as current of the item that is going for sale now and create the mapping
        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        // Putting an item for sale, with the owner being no one
        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender), 
            payable(address(0)),
            price,
            false
        );

        // transfer ownership of nft to the contract once listed as sold
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        // emit the event saying the market item has been created for sale
        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender), 
            payable(address(0)),
            price,
            false
        );
    }

    // function to create a market sale
    function createMarketSale(
        address nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        // get a reference to price and token id using the mapping
        uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;

        // require that the person sending this transaction has sent in the correct value
        require(msg.value == price, "please submit the asking price in order to complete the purchase");

        // transfer value of transaction to seller
        idToMarketItem[itemId].seller.transfer(msg.value);

        // transfer ownership of nft from contract addres to buyer
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        // set local value for owner to be the msg.sender and set the bool sold to true
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();
        // pay listing price commission to owner of the marketplace
        payable(owner).transfer(listingPrice);
    }

    // function that returns all unsold items
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        // item count is the total of number of items and get unsold item count
        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();

        uint currentIndex = 0;
        // loop over number of items created and increment that number if it has an empty address meaning it is unsold
        MarketItem[] memory items = new MarketItem[](unsoldItemCount); // length of unsolditems
        for (uint i = 0; i < itemCount; i ++ ) {
            // check if item is unsold by looking at the onwer of the market item and see if it is empty
            if (idToMarketItem[i+1].owner == address(0)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    
    // function that returns all items I purchased
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        // total item count is the total of number of items purchased
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        // loop over nmumber of items and increment that number if it the owner is equal to the person that call this function
        for (uint i=0;i <totalItemCount; i++) {
            if (idToMarketItem[i+1].owner == msg.sender){
                itemCount +=1 ;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount); // length of owned items
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i+1].owner == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    // function all nfts the user has created themselves
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i=0;i <totalItemCount; i++) {
            if (idToMarketItem[i+1].seller == msg.sender){
                itemCount +=1 ;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount); 
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i+1].seller == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }
}