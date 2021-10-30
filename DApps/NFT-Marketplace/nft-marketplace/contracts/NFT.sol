// SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// allows us to access the set token uri to set the token uri
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// utility for incrementing numbers 
import "@openzeppelin/contracts/utils/Counters.sol";

// Set constructor (inheriting from the the storage module that itself inherits from the erc721 module)
contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    // allows to keep track of the incrementing value for a unique identifier for each token (every time a token 
    // is minted it will have an incrementing id value)
    Counters.Counter private _tokenIds;

    // contract address will be the address of the marketplace that the marketplace will interact with
    address contractAddress;

    constructor(address marketplaceAddress) ERC721("Metaverse Tokens", "METT") {
        contractAddress = marketplaceAddress;
    }

    // create token (minting new tokens) we need to pass in tokenURI
    function createToken(string memory tokenURI) public returns (uint) {
        // increment token id
        _tokenIds.increment();
        // set new token id tothe current incremented value
        uint256 newItemId = _tokenIds.current();
        
        // mint the token
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        // allow the marketplace to approval transact the token between users from within another contract
        setApprovalForAll(contractAddress, true);

        // used for the frontend (to be able to know what id we are selling)
        return newItemId;
    }
}

