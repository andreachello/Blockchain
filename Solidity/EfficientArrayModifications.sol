// SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.3;

contract Array {
    // dynamic array
    uint[] public nums = [1,2,3];
    // fixed size array
    uint[3] public numsFixed = [4,5,6];

    function examples() external {
        nums.push(4);
        uint x = nums[1];
        // update element
        nums[2] = 777;
        // delete element will set to default value (uint is zero) length of array is same
        delete nums[1];
        // remove last element of array
        nums.pop();
        // length
        uint len = nums.length;

        // create array in memory will be of fixed size (no push nor push) can only update or get values
        uint[] memory a = new uint[](5);
    }

    // not recommended as it uses a lot of gas
    function retunArray() external view returns(uint[] memory) {
        return nums;
    }
}

contract ArryShift{
    uint[] public arr;

    function setArray(uint _num) public {
        arr.push(_num);
    }

    function getArray() public view returns(uint[] memory) {
        return arr;
    }

    function example() public {
        arr = [1,2,3];
        delete arr[1]; // [1, 0, 3]
    }

    // NOT GAS EFFICIENT
    // remove and shrink by shift all elements to left and popping - copy elements from right to left and remove the last
    function remove(uint _index) public {
        require(_index < arr.length, "index out of bounds");
        
        for (uint i = _index; i < arr.length - 1; i++) {
            // shift element
            arr[i] = arr[i+1];

        }
        // pop last element
        arr.pop();
    }

    function test() external {
        arr = [1,2,3,4,5];
        remove(2);
        assert(arr[0] == 1);
        assert(arr[1] == 2);
        assert(arr[2] == 4);
        assert(arr[3] == 5);
        assert(arr.length == 4);
    }

    // MORE GAS EFFICIENT - BUT ORDER NOT PRESERVED
    /*
    Replace element that we want to remove with the last element

    [1,2,3,4] -- remove(1) --> [1,4,3]
     */

     function ArrayReplaceLast(uint _index) public {
         arr[_index] = arr[arr.length-1];
         arr.pop();
     }

     function testArrayLast() external {
         arr = [1,2,3,4];
         ArrayReplaceLast(1);
        assert(arr[0] == 1);
        assert(arr[1] == 4);
        assert(arr[2] == 3);
        assert(arr.length == 3);

     }
}

