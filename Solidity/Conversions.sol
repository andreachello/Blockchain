pragma solidity >= 0.7.0 < 0.9.0;

/*

UINT

uints are unsigned integers, meaning its value must be non-negative (ints are signed integers)

In Solidity uint defaults to uint256, a 256-bit unsigned integer. We can declare
uints withs less bits - uint8, uint16, etc.

uint256 has a:
- Minimum value of 0
- Maximum value of 2^256-1

*/

contract Conversions {
    
    // Conversion to smaller types costs higher order bits
    uint32 a = 0x12345678;
    uint16 b = uint16(a); // b = 0x5678
    
    // Conversion to higher types adds padding bits to the left
    uint16 c = 0x1234;
    uint32 d = uint32(c); //c=0x0000123
    
    // Conversion in Bytes are the opposite to conversions in uints
    
    // Conversion to smaller bytes costs higher order data
    bytes2 e = 0x1234;
    bytes1 f = bytes1(e); // f = 0x12
    
    // Conversion to larger bytes adds padding bits to the right
    bytes2 g = 0x1234;
    bytes4 h = bytes4(g); // h = 0x12340000
}

/*

Ether Units

wei is the smallest denomination of ether:

10^18 wei = 1 eth  = 1000000000000000000 wei

*/

contract EtherUnits {
    
    // assert makes the function run only if the assertion is true
    
    function test() public {
        assert(1000000000000000000 wei == 1 ether);
        assert(1 wei == 1);
        assert(1 ether == 1e18);
        assert(2000000000000000000 wei == 2 ether);
    }
}

/*

Time units

Solidity has: 

- minutes

- hours

- days

- weeks

*/

contract TimeUnitConversion {
    function test() public {
        assert(60 seconds == 1 minutes);
        assert(60 minutes == 1 hours);
        assert(24 hours == 1 days);
        assert(7 days == 1 weeks);
    }
}
