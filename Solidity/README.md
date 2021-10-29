<img src="https://res.cloudinary.com/practicaldev/image/fetch/s--Rxmub8vz--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5jd65usaioipnkv5xs5a.png" width="150px" />

# Introduction to Solidity Programming

This is intended as a comprehensive guide towards learning the Solidity Programming Language.

## Table of Contents

### 1. Strings

Strings in Solidity and in Blockchain are computationally expensive, therefore, we first store them in memory, similar to RAM, i.e. a temporary memory block, and then in order to make any computation on the strings we need to convert them into `bytes` first.

### 2. OOP in Solidity

Solidity is an Object-Oriented Language that replaces the keywork **Class** with the keyword **Contract**. Here we will learn about the four pillars of OOP applied to Solidity:

a. Encapsulation

b. Abstraction

c. Inheritance

d. Polymorphism

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

### 14. Cryptographic Functions

### 15. Random Number Generators in Solidity (RNG)

### 16. Oracle Smart Contracts
