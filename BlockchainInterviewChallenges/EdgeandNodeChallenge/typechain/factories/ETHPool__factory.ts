/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ETHPool, ETHPoolInterface } from "../ETHPool";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_address",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_address",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "depositRewards",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasStaked",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "stakers",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "stakingBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalCurrentStake",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610b2a806100206000396000f3fe6080604052600436106100595760003560e01c8063152111f71461022e5780633ccfd60b1461023857806345bc78ab1461024f5780637f0e54631461028c578063c93c8f34146102b7578063fd5e6dd1146102f457610229565b3661022957600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16610113576001339080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b34600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546101629190610824565b925050819055506001600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550346000808282546101d29190610824565b925050819055503373ffffffffffffffffffffffffffffffffffffffff167fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c3460405161021f91906107f8565b60405180910390a2005b600080fd5b610236610331565b005b34801561024457600080fd5b5061024d6104aa565b005b34801561025b57600080fd5b50610276600480360381019061027191906106b5565b61060e565b60405161028391906107f8565b60405180910390f35b34801561029857600080fd5b506102a1610626565b6040516102ae91906107f8565b60405180910390f35b3480156102c357600080fd5b506102de60048036038101906102d991906106b5565b61062c565b6040516102eb919061079d565b60405180910390f35b34801561030057600080fd5b5061031b600480360381019061031691906106e2565b61064c565b6040516103289190610782565b60405180910390f35b6000805411610375576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161036c906107b8565b60405180910390fd5b60005b6001805490508110156104a75760006001828154811061039b5761039a6109f4565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905060006064346000546064600260008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461041c91906108ab565b610426919061087a565b61043091906108ab565b61043a919061087a565b905080600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461048b9190610824565b925050819055505050808061049f9061094d565b915050610378565b50565b6000600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905060008111610531576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610528906107d8565b60405180910390fd5b6000600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501580156105bc573d6000803e3d6000fd5b503373ffffffffffffffffffffffffffffffffffffffff167f884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a94243648260405161060391906107f8565b60405180910390a250565b60026020528060005260406000206000915090505481565b60005481565b60036020528060005260406000206000915054906101000a900460ff1681565b6001818154811061065c57600080fd5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008135905061069a81610ac6565b92915050565b6000813590506106af81610add565b92915050565b6000602082840312156106cb576106ca610a23565b5b60006106d98482850161068b565b91505092915050565b6000602082840312156106f8576106f7610a23565b5b6000610706848285016106a0565b91505092915050565b61071881610905565b82525050565b61072781610917565b82525050565b600061073a604783610813565b915061074582610a28565b606082019050919050565b600061075d601883610813565b915061076882610a9d565b602082019050919050565b61077c81610943565b82525050565b6000602082019050610797600083018461070f565b92915050565b60006020820190506107b2600083018461071e565b92915050565b600060208201905081810360008301526107d18161072d565b9050919050565b600060208201905081810360008301526107f181610750565b9050919050565b600060208201905061080d6000830184610773565b92915050565b600082825260208201905092915050565b600061082f82610943565b915061083a83610943565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561086f5761086e610996565b5b828201905092915050565b600061088582610943565b915061089083610943565b9250826108a05761089f6109c5565b5b828204905092915050565b60006108b682610943565b91506108c183610943565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156108fa576108f9610996565b5b828202905092915050565b600061091082610923565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600061095882610943565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561098b5761098a610996565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600080fd5b7f496e206f7264657220746f206465706f7369742072657761726473207468657260008201527f65206d757374206265207374616b6572732063757272656e746c7920696e207460208201527f686520706f6f6c00000000000000000000000000000000000000000000000000604082015250565b7f4e6f7468696e67206c65667420746f2077697468647261770000000000000000600082015250565b610acf81610905565b8114610ada57600080fd5b50565b610ae681610943565b8114610af157600080fd5b5056fea264697066735822122026bf70c130973e46308057d5e2d1a1e3659573d04952473fc0dc77188a9b89e364736f6c63430008070033";

export class ETHPool__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ETHPool> {
    return super.deploy(overrides || {}) as Promise<ETHPool>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ETHPool {
    return super.attach(address) as ETHPool;
  }
  connect(signer: Signer): ETHPool__factory {
    return super.connect(signer) as ETHPool__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ETHPoolInterface {
    return new utils.Interface(_abi) as ETHPoolInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ETHPool {
    return new Contract(address, _abi, signerOrProvider) as ETHPool;
  }
}
