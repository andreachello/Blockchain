pragma solidity ^0.5.0;

contract Marketplace {

    string public name;

    // need to know how many products there are, increment the product count
    uint public productCount = 0;

    // hashing product id to products
    mapping(uint => Product) public products;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor() public {
        name = "Marketplace";
    }

    // create a product as a seller
    function createProduct(
        string memory _name,
        uint _price) public {
        // require a name
        require(bytes(_name).length>0);
        // require a price
        require(_price > 0);
        // increment product count
        productCount ++;
        // create the product
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        // trigger an event (log out event)
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    // purchasing products
    function purchaseProduct(uint _id) public payable {
        // fetch product (create a copy) and list it in memory
        Product memory _product = products[_id];
        // fetch owner
        address payable _seller = _product.owner;
        // make sure product has valid id
        require(_product.id > 0 && _product.id <= productCount);
        // require there is enough ether in the transaction
        require(msg.value >= _product.price);
        // require that product has not been purchased already
        require(!_product.purchased);
        // require that buyer is not seller
        require(_seller != msg.sender);
        // purchase it (transfer ownership to buyer)
        _product.owner = msg.sender;
        // mark as purchased
        _product.purchased = true;
        // update the product
        products[_id] = _product;
        // pay the seller by sending them ether
        address(_seller).transfer(msg.value);
        // trigger an event
        emit ProductCreated(productCount, _product.name, _product.price, msg.sender, true);

    }
}