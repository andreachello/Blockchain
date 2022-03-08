// SPDX-License-Identifier: MIT
pragma solidity 0.8;

/*
Storage Patterns:

- Using Struct + Array Only: this gives us a way to perform operations such 
                              as counting the number of addresses but the lookup
                              of an individual address is computationally expensive

- Using Struct + Mapping Only: this give us a fast way to lookup any address but does
                               not give us a way to find the number of addresses in total
                               i.e. the count

- Using Struct + Mapping + Array: this gives us the fast lookup of addresses using the 
                                  mapping, and we can store a flag of if the entity exists
                                  in our struct in order to identify if we should include 
                                  the entity or not in our array, with which we can perform
                                  computations such as count, etc.
*/

contract StoragePatternTemplate {

    // Structure of our data - Generic Entity
    struct EntityStruct {
        uint entityData;
        uint listPointer; // reference to the index in the list - zero indexed
    }

    // MAPPINGS: easy access to lookups for an address
    mapping(address => EntityStruct) public entityStructs;

    // ARRAY: array for the addresses to get the count regardless of the fact
    // that we are using a mapping - for which we cannot get a count of
    // this eliminates the initial zero value problem 
    address[] public entityList;

    // Check if the array of entities is empty
    // Return whether or not the address has the REFERENCE POINTER FLAG
    // meaning if the entity does not exist there is no reference ID - listPointer
    // addresses the problem with duplicates
    function isEntity(address entityAddress) public view returns(bool isIndeed) {
        if(entityList.length == 0) return false;
        return (entityList[entityStructs[entityAddress].listPointer] == entityAddress);
    }

    // Since we are working with arrays we can get the length of the entities so their
    // count
    function getEntityCount() public view returns(uint entityCount) {
        return entityList.length;
    }

    // CREATE: new entity according to our Structure 
    function newEntity(address entityAddress, uint entityData) public returns(bool success) {
       
        // Check if the entity already exists - revert if true
        if(isEntity(entityAddress)) revert();

        // Set the entity data for our struct at the address to the inputted entityData
        entityStructs[entityAddress].entityData = entityData;

        // push the address to the list of enitities
        entityList.push(entityAddress);

        // set the ID of the listPointer for said entity to the length of the
        // length of the array - 1, i.e. zero-indexed ID
        entityStructs[entityAddress].listPointer = entityList.length - 1;

        // return success if everything ran
        return true;
    }

    // UPDATE: existing entity
    function updateEntity(address entityAddress, uint entityData) public returns(bool success) {
        
        // If there is no entity associated with the address then revert
        if(!isEntity(entityAddress)) revert();

        // update the entityData of the specified address with the inputted entityData
        entityStructs[entityAddress].entityData = entityData;

        // return success
        return true;
    }

    // DELETE: existing entity - needed in order to not have the list grow indefinitely
    function deleteEntity(address entityAddress) public returns(bool success) {

        // If there is no entity associated with the address then revert
        if(!isEntity(entityAddress)) revert();

        // CURRENT ELEMENT: fetch the ID or index in the array of the address - the place in the array
        // i.e. listPointer - associated with the address
        uint rowToDelete = entityStructs[entityAddress].listPointer;

        // LAST ELEMENT: get the address at the end of the entity list - zero-indexed so 
        // last element is length - 1
        address keyToMove = entityList[entityList.length-1];

        // MOVE VALUES: Replace the CURRENT ELEMENT's value in the array at 
        // the CURRENT INDEX with the value of the LAST ELEMENT at the 
        // LAST INDEX in the array
        entityList[rowToDelete] = keyToMove;

        // MOVE INDEX: change the index of the LAST ELEMENT in the struct
        // to point to - listPointer - the CURRENT INDEX
        entityStructs[keyToMove].listPointer = rowToDelete;

        // DELETE LAST ELEMENT
        entityList.pop();

        // DELETE MAPPING at CURRENT ADDRESS
        delete entityStructs[entityAddress];

        // return success
        return true;
    }
}
