pragma solidity >= 0.7.0 < 0.9.0;

/*

Arrays in solidity

Stores data of the same type

*/

contract Arrays {
    
    // Writing an Arrays
    uint [] public arrayOne;
    uint [200] public staticArray; // fixed-size array
    
    // Methods on Arrays
    // 1. Push
    
    function push(uint number) public {
        arrayOne.push(number);
    }
    
    // 2. Pop - removes from last element
    
    function pop() public {
        arrayOne.pop();
    }
    
    // 3. Length of an array
    function getLength() public view returns(uint) {
        return arrayOne.length;
    }
    
    // 4. Remove indexed elements from array
    
    function remove(uint i) public {
        
        // deleting makes the length remain the same and it replaces the
        // indexed element with zero - reset value to zero
        delete arrayOne[i];
    } 
    
    // 5. Remove element in Solidity
    uint [] newArray;
    
    function removeElement(uint i) public {
       
        for (uint j; j < arrayOne.length; j++) {
            if (j != i) {
                newArray.push(j);
            }
        }
       
       newArray[newArray.length-1] = arrayOne[i];
       
       arrayOne = newArray;
    }
}


