<img src="https://res.cloudinary.com/practicaldev/image/fetch/s--Rxmub8vz--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5jd65usaioipnkv5xs5a.png" width="150px" />

# Introduction to Solidity Programming

This is intended as a comprehensive guide towards learning the Solidity Programming Language as well as a reference repo to be downloaded in order to look back at previous concepts as a refrehser.

## Table of Contents

[0. Variable Scope](### 0. Variable Scope)
[1. Strings](### 1. Strings)
[2. Simple OOP in Solidity](### 2. Simple OOP in Solidity)

------------

### 0. Variable Scope

### 1. Strings

Strings in Solidity and in Blockchain are computationally expensive, therefore, we first store them in memory, similar to RAM, i.e. a temporary memory block, and then in order to make any computation on the strings we need to convert them into `bytes` first.

### 2. Simple OOP in Solidity

Solidity is an Object-Oriented Language that replaces the keywork **Class** with the keyword **Contract**. Here we will learn about simple OOP in Solidity.

### 3. Arrays

Creating arrays in Solidity is similar to other programming languages with the exception of deleting an element based on a pre-defined index. We will look at a workaround to this problem, as well as introduce the main methods used in arrays and how to initialise them in Solidity.


### 4. Enums

are custom data types a user can specify which will return the enumarted indices of the values of the data type, in which we specify restrictions in order to specify concise variable attributes.

### 5. Structs

Are custom data types used to represent a record.

### 6. Mapping

Mapping is a reference type as arrays and structs, as it creates a reference.
It allows to save data and add a key that we can specify and then retrieve that information later on.

### 7. Uint/Byte/Ether and Time Conversions

Conversions from lower type uints to higher type uints and viceversa, from smaller bytes to larger bytes and viceversa, from wei to ether, and conversions using time suffixes.

### 8. Blockchain Global Variables

here are special variables i.e global variables in Solidity and provide 
information about the blockchain:

- msg.sender: sender of the message (current function call)

- msg.value: is a uint representing the number of wei sent with the message

- block.timestamp: is the current block timestamp as seconds since unix epoch

- block.number: is a uint representing the current block number

### 9. Function Modifiers

Function modifiers are used to modify the behaviour of a function.

for example to restrict use or add a prerequisite to a function.

### 10. View vs. Pure

They are Pre-Built-in Modifiers

a. View Functions:

- ensure that the functions will not modify the state

- they return values

b. Pure Functions:

- ensure that they will not read nor modify the state

- return calculations

### 11. Events

Smart contracts can log that something has happened on the blockchain by firing events

Applications can be notified when an event is emitted instead of constantly monitoring a contract
on a blockchain for state changes to occur.

### 12. Fallback Functions

 - cannot have a name - anonymous function
 
 - do not take any inputs
 
 - do not return any output
 
 - must be declared as external
 
 We use them when we call functions that do not exist, or send ether to a contract
 by send, transfer or call.

### 13. Function Overloading

is when we can have multiple definitions for the same function in the same scope.

The definition of the function must differ from each other by the types and/or
number of arguments in the argument list.

We cannot overload function declarations that differ only by return type.

### 14. Cryptographic Functions and RNG

Cryptographic Hash Functions (CHF)

are mathematical algorithms that map data of aribtrary size (called the message)
to a bit array of a fixed size (the "hash value" or "hash").

It is a one-way function i.e. it is generally impossible to invert or reverse the computation

(more on this here: https://medium.com/the-quant-journey/cryptography-and-the-motivation-behind-blockchain-6edded49b4ae)

Solidity provides inbuilt cryptographic functions:

- keccak256 (bytes memory) returns (bytes32) - computes the Keccak-256 hash of th input

- sha256 (bytes memory) returns (bytes32) - computes the SHA-256 hash of the input

- ripemd160 (bytes memory) returns (bytes20) - computes the RIPEMD-160 hash of the input

Keccak is a leading hashing functions and is a family of cryptpgraphic sponge functions
designed as an alternative to SHA-256


### 15. Oracle Smart Contracts

Blockchain oracles are third-party services that provide smart contracts with external information. 
They serve as bridges between blockchains and the outside world.

Oracle dynamic feeds are the dynamically changing outside data that we feed into our smart contracts.

Here we want to build an Oracle such that the random number generator is less subject to
miner manipulation, given miners already know information like the block number etc.

### 16. Simple Subcurrency Tokens

How to Structure a Coin:

- Allows only the creator to create new coins (Issuance)

- Anyone can send coins to each other without a need for registering info

### 17. Cybersecurity in Solidity: Points of Failure and Vulnerabilities in Smart Contracts

Transfers are atomic (meaning all or nothing is executed) therefore represent a cybersecurity risk.

### 18. Withdrawal Pattern

By making our transaction one at a time we greatly reduce the danger to our execution

It is not safe to interact with more than one customer at a time 

### 19. Restricted Access Pattern

By default, a contract state is read-only unless it is specified as public.

We can customize our modifiers to include the following restrictions:

- 1. onlyBy: only the mentioned caller can call this function (OnlyOwner/Change ownership)

- 2. onlyAfter: called after a certain time period

- 3. costs: call this function only if certain values are provided

### 20. Advanced OOP in Solidity

Four Pillars:

a. Encapsulation

b. Abstraction

c. Inheritance

d. Polymorphism
