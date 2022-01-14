// SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.3;

contract Structs {
    // Structs allow to group data together
    struct Car {
        string model;
        uint year;
        address owner;
    }

    // struct as a state variable
    Car public car;
    // array of struct
    Car[] public cars;
    // mapping from owners to cars and owner can have multiple cars
    mapping(address => Car[]) public carsByOwner;

    // initialize a struct
    function examples() external {
        Car memory toyota = Car("Toyota", 1990, msg.sender); // same as next
        Car memory lambo = Car({model: "Lamborghini", year: 1980, owner: msg.sender}); // here order does not matter
        // default value
        Car memory tesla;
        tesla.model = "Tesla";
        tesla.year = 2010;
        tesla.owner = msg.sender;

        // insert in a state variable - push in the car array
        cars.push(toyota);
        cars.push(lambo);
        cars.push(tesla);

        // create struct and push in array
        cars.push(Car("Ferrari", 2020, msg.sender));

        // get first car from struct
        Car memory _car = cars[0];
        _car.model; //etc

        // Modify value in a struct - use storage so when function is executed the state is saved
        _car.year = 1999;

        // Reset owner by deleting
        delete _car.owner;

        delete cars[1];
    }
}
