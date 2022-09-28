pragma solidity >= 0.7.0 < 0.9.0;

/*

Mapping is a reference type as arrays and structs, as it creates a reference.
It allows to save data and add a key that we can specify and then retrieve that information later on.

In Solidity we cannot iterate through a map - we need to store the keys in an array and we cannot
get the size

*/

contract Mapping {
    
    // Input: Key-Value
    // we create a library that has keys and values (addresses:key, etc)
    
    // key => value visibility variable
    mapping(address => uint) public myMap;
    
    // Get addresses
    function getAddress(address _addr) public view returns(uint) {
        return myMap[_addr];
    }
    
    // set addresses to the map
    function setAddress(address _addr, uint _i) public {
        myMap[_addr] = _i;
    }
    
    // remove addresses
    function removeAddress(address _addr) public {
        delete myMap[_addr];
    }
}

// Updating a mapping by using a struct as value

contract MovieMapping {
    struct Movie {
        string title;
        string director;
    }

    mapping(uint => Movie) public movieMap;
    
    
    function addMovie(uint _id, string memory _title, string memory _director) public {
        movieMap[_id] = Movie(_title, _director);
    }
}

// NESTED mapping
// maps within maps

// Example applications:

// 1. If we wanted to store movies that belong to a certain person or address 

// 2. Allow one address to spend on behalf of another address (ERC20 Tokens)

// msg.sender is a global variable that captures the address that is calling the contract

contract MovieNestedMapping {
    struct Movie {
        string title;
        string director;
    }
    
    mapping(uint => Movie) public movieMap;
    mapping(address => mapping(uint => Movie)) public myMovie;
    
    function addMovie(uint _id, string memory _title, string memory _director) public {
        movieMap[_id] = Movie(_title, _director);
    }
    
    function addMovieToAddress(uint _id, string memory _title, string memory _director) public {
        myMovie[msg.sender][_id] = Movie(_title, _director);
    }
}
