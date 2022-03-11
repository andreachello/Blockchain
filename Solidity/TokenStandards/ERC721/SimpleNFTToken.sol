// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*

ERC721 Differences compared to ERC20
--------------------------------------

- Attributes for each Token:
Each token can be represented by a Struct with different attributes for the
token. This object definition is put into an array of token Structs and each have
a different id.

- Ownership Mapping:
from token ID to address

- Creation of Token:
update mapping and array

- Count of owned Tokens by Address:
mapping of address to uint

- Transfer Function paramenters:
token ID
address to send

there is no amount to send so we send the ID instead
*/

contract Kittycontract {

    string public constant name = "TestKitties";
    string public constant symbol = "TK";
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    event Birth(
        address owner, 
        uint256 kittenId, 
        uint256 mumId, 
        uint256 dadId, 
        uint256 genes
    );

    // Properties or attributes of the ERC721 token
    struct Kitty {
        uint256 genes;
        uint64 birthTime;
        uint32 mumId;
        uint32 dadId;
        uint16 generation;
    }

    // array containing all the tokens as structs
    Kitty[] kitties;

    // It has to be ID to Owner as an address can only have 1 ERC721 with that 
    // specific ID so doing it the other way around would simply override the 
    // current ownership
    mapping (uint256 => address) public kittyIndexToOwner;

    // Count of owned Tokens by Address:
    mapping (address => uint256) ownershipTokenCount;

    // keep track of the IDs that the address owns in a uint array
    mapping(address => uint[]) ownerToCats;


    function balanceOf(address owner) external view returns (uint256 balance){
        return ownershipTokenCount[owner];
    }

    function totalSupply() public view returns (uint) {
        return kitties.length;
    }

    function ownerOf(uint256 _tokenId) external view returns (address)
    {
        return kittyIndexToOwner[_tokenId];
    }

    function transfer(address _to,uint256 _tokenId) external
    {
        // check if address is not null and is not the current contract 
        require(_to != address(0));
        require(_to != address(this));
        // check if the msg.sender owns the ERC721 token by ID
        require(_owns(msg.sender, _tokenId));

        // Execute the transfer
        _transfer(msg.sender, _to, _tokenId);
    }
    
    // get all ERC721 that an address owns
    function getAllCatsFor(address _owner) external view returns (uint[] memory cats){
        cats = ownerToCats[_owner];
    }
    
    // create the First or Zeroth generation of ERC721 - Test Function
    // Should be usually restricted to the onwer only or specified in 
    // the constructor
    function createKittyGen0(uint256 _genes) public returns (uint256) {
        return _createKitty(0, 0, 0, _genes, msg.sender);
    }

    // Create a ERC721 Token
    // this accepts all the parameters specified in the struct as well as the owner
    function _createKitty(
        uint256 _mumId,
        uint256 _dadId,
        uint256 _generation,
        uint256 _genes,
        address _owner
    ) private returns (uint256) {
        // create new Struct with the parameters
        Kitty memory _kitty = Kitty({
            genes: _genes,
            birthTime: uint64(block.timestamp),
            mumId: uint32(_mumId),
            dadId: uint32(_dadId),
            generation: uint16(_generation)
        });
        
        // Insert the ERC721 token into the token array
        kitties.push(_kitty);

        // Set the ID as the zero-indexed length of the arrray
        uint256 newKittenId = kitties.length - 1;

        // emit the event
        emit Birth(_owner, newKittenId, _mumId, _dadId, _genes);

        // Mint - Transfer from the null address to the owner the newly created ERC721
        // with the new ID
        _transfer(address(0), _owner, newKittenId);

        return newKittenId;

    }

    // Transfer Execution function for ERC721 tokens by ID
    function _transfer(address _from, address _to, uint256 _tokenId) internal {

        // Increase the token count owned by the receiving address
        ownershipTokenCount[_to]++;

        // Set the array of tokens at the index of the token ID's address
        // to the receiver address
        kittyIndexToOwner[_tokenId] = _to;

        // add Token ID to the array of IDs in the owner to IDs mapping
        ownerToCats[_to].push(_tokenId);

        // Check that the sender is not a null address
        if (_from != address(0)) {
            // Decrease the token count owned by the Sending address
            ownershipTokenCount[_from]--;
            _removeTokenIdFromOwner(_from, _tokenId);
        }

        // Emit the transfer event.
        emit Transfer(_from, _to, _tokenId);
    }

    // Remove the token ID when the ownership of the token is transferred
    function _removeTokenIdFromOwner(address _owner, uint256 _tokenId) internal {
        
        // save a copy of the LAST ID - token - that the address/owner has - zero indexed: get last index 
        // meaning length - 1
        uint256 lastId = ownerToCats[_owner][ownerToCats[_owner].length-1];
       
        // move the value of the last ID to the one we are transferring - i.e. the tokenID.
        ownerToCats[_owner][_tokenId] = lastId;

        // Delete last element
        ownerToCats[_owner].pop();
    }

    // Check for ownership of the ERC721 Unique token
    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
      return kittyIndexToOwner[_tokenId] == _claimant;
  }

}
