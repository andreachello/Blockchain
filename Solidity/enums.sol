pragma solidity >= 0.7.0 < 0.9.0;

// Enums restrict a variable to have one of only a few predefined values
// the values in this enumerated list are the Enums

// Using enums reduces the bugs in code as we are restricting the variables

// Enum for an eCommerce app that offers products variants either large, medium or small options

// Similar to custom datatypes in typescript but they output the enumerated index of the 
// pposition of the values

contract Sizes {
    
    enum productSize {LARGE, MEDIUM, SMALL}
    // introduce the data into a variable
    productSize choice;
    productSize constant defaultChoice = productSize.MEDIUM;
    
    function setSmall() public {
        choice = productSize.SMALL;
    }
    
    function getChoice() public view returns(productSize) {
        return choice;
    }
    
    function getDefaultChoice() public view returns(uint) {
        return uint(defaultChoice);
    }
}

contract Shirts {
    enum shirtColor {RED, WHITE, GREEN}
    shirtColor choice;
    shirtColor constant defaultChoice = shirtColor.RED;
    
    function setWhite() public {
        choice = shirtColor.WHITE;
    }
    
    function getChoice() public view returns(shirtColor) {
        return choice;
    }
    
    function getDefaultChoice() public view returns(uint) {
        return uint(defaultChoice);
    }
    
}

