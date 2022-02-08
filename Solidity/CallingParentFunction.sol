pragma solidity 0.8;

contract E {
    event Log(string message);
    
    function foo() public virtual {
        emit Log("E.foo");
    }

    function bar() public virtual {
        emit Log("E.bar");
    }
}

contract F is E {

    function foo() public virtual override {
        emit Log("F.foo");
        // call parent function
        E.foo();
    }

    function bar() public virtual override {
        emit Log("F.bar");
        // call parent function
        super.bar();
    }
}

contract G is E {

    function foo() public virtual override {
        emit Log("G.foo");
        // call parent function
        E.foo();
    }

    function bar() public virtual override {
        emit Log("G.bar");
        // call parent function
        super.bar();
    }
}

contract H is F, G {

    function foo() public virtual override(F,G) {
        emit Log("H.foo");
        // call parent function
        F.foo();
    }

    function bar() public virtual override(F,G) {
        emit Log("H.bar");
        // call parent function
        super.bar();
    }
}
