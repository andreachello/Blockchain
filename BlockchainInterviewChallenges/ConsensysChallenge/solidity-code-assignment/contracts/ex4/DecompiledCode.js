contract disassembler {

    function func_000000AE( uint256 arg0,uint256 arg1,uint256 arg2) private returns (var0)
    {
        var1 = arg0;
        var5 = func_00000151(sload(arg0));
        mstore(0x0,arg0);
        temp2 = keccak256(0x0,0x20);
        var4 = temp2;
        temp3 = (0x1F + var5);
        if (arg2) 
        {
            if ((0x1F < arg2)) 
            {
                sstore(arg0,(0x1 + (arg2 + arg2)));
                if (arg2) 
                {
                    var3 = arg1;
                    var5 = (arg1 + arg2);
                    label_00000107:
                    if ((var3 > var5)) 
                    {
                    label_00000123:
                        var2 = 0x130;
                        var3 = var2;
                        goto label_00000134;
                    }
                    else
                    {
                        temp4 = mload(var3);
                        sstore(var4,temp4);
                        var3 = (0x20 + var3);
                        var4 = (0x1 + var4);
                        goto label_00000107;
                    }
                }
                else
                {
                    var2 = 0x130;
                    var3 = var2;
                    label_00000134:
                    label_00000135:
                    if ((var4 > var3)) 
                    {
                        return(var1);
                    }
                    else
                    {
                        sstore(var4,0x0);
                        var4 = (0x1 + var4);
                        goto label_00000135;
                    }
                }
            }
            else
            {
                sstore(arg0,(arg2 + arg2));
                goto label_00000123;
            }
        }
        else
        {
            sstore(arg0,0x0);
            goto label_00000123;
        }
    }

    function func_00000151( uint256 arg0) private returns (var0)
    {
        var7 = (arg0 / 0x2);
        var8 = (arg0 & 0x1);
        if ((arg0 & 0x1)) 
        {
            if ((var8 == (var7 < 0x20))) 
            {
                label_00000175:
                mstore(0x0,0x4E487B7100000000000000000000000000000000000000000000000000000000);
                mstore(0x4,0x22);
                revert(0x0,0x24);
            }
            else
            {
                label_0000017D:
                return(var7);
            }
        }
        else
        {
            var7 = (var7 & 0x7F);
            if ((var8 == (var7 < 0x20))) 
            {
                goto label_00000175;
            }
            else
            {
                goto label_0000017D;
            }
        }
    }

    function main() public return ()
    {
        mstore(0x40,0x80);
        mstore(0x40,0xC0);
        mstore(0x80,0xC);
        mstore(0xA0,0x696E697469616C69736564310000000000000000000000000000000000000000);
        temp0 = mload(0x80);
        var0 = func_000000AE(0x0,0xA0,temp0);
        mstore(0x40,0x100);
        mstore(0xC0,0xC);
        mstore(0xE0,0x696E697469616C69736564320000000000000000000000000000000000000000);
        temp6 = mload(0xC0);
        var0 = func_000000AE(0x1,0xE0,temp6);
        var0 = msg.value;
        require(!msg.value);
        callcodecopy(0x0,0x1C1,0x537);
        RETURN(0x0,0x537);
    }

}
