pragma solidity >= 0.7.0 < 0.9.0;

/*

Smart contracts can log that something has happened on the blockchain by firing events

Applications can be notified when an event is emitted instead of constantly monitoring a contract
on a blockchain for state changes to occur

*/

contract Event {
    
    // pass the data we want to log to the blockchain
    event Log(address sender, string message);
    
    // firing events
    function fireEvents() public {
        // firing the events through emit
        emit Log(msg.sender, "Hello World!");
    }
}

// Output

/*
[
	{
		"from": "0xf8e81D47203A594245E36C48e151709F0C19fBe8",
		"topic": "0x0738f4da267a110d810e6e89fc59e46be6de0c37b1d5cd559b267dc3688e74e0",
		"event": "Log",
		"args": {
			"0": "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
			"1": "Hello World!",
			"sender": "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
			"message": "Hello World!"
		}
	}
]

*/
