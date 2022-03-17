/*
- Abstract
Externally Owned Accounts (EOA) can sign messages with their associated private keys, but currently contracts cannot. 
We propose a standard way for any contracts to verify whether a signature on a behalf of a given contract is valid. 
This is possible via the implementation of a isValidSignature(hash, signature) function on the signing contract, which can be called to validate a signature.

- Motivation
There are and will be many contracts that want to utilize signed messages for validation of rights-to-move assets or other purposes. 
In order for these contracts to be able to support non Externally Owned Accounts (i.e., contract owners), 
we need a standard mechanism by which a contract can indicate whether a given signature is valid or not on its behalf.

One example of an application that requires signatures to be provided would be decentralized exchanges with off-chain orderbook, 
where buy/sell orders are signed messages. In these applications, EOAs sign orders, signaling their desire to buy/sell a given asset 
and giving explicit permissions to the exchange smart contracts to conclude a trade via a signature. When it comes to contracts however,
regular signatures are not possible since contracts do not possess a private key, hence this proposal.

EIP-1271 https://eips.ethereum.org/EIPS/eip-1271
*/

pragma solidity ^0.5.0;

contract ERC1271 {

  // bytes4(keccak256("isValidSignature(bytes32,bytes)")
  bytes4 constant internal MAGICVALUE = 0x1626ba7e;

  /**
   * @dev Should return whether the signature provided is valid for the provided hash
   * @param _hash      Hash of the data to be signed
   * @param _signature Signature byte array associated with _hash
   *
   * MUST return the bytes4 magic value 0x1626ba7e when function passes.
   * MUST NOT modify state (using STATICCALL for solc < 0.5, view modifier for solc > 0.5)
   * MUST allow external calls
   */ 
  function isValidSignature(
    bytes32 _hash, 
    bytes memory _signature)
    public
    view 
    returns (bytes4 magicValue);
}
