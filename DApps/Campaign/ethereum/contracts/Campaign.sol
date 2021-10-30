pragma solidity ^0.4.17;

// factory is used to create a multi-campaign system
contract CampaignFactory {
    // addresss of all deployed campaigns
    address[] public deployedCampaigns;

    // deploys a new instance of a Campaign and stores the resulting address
    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender); // user who creates
        deployedCampaigns.push(newCampaign);
    }

    // returns a list of all deployed campaigns
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    
    // request struct, as a class, whenever a manager wants to create a request 
    // the manager will create an instance of this class
    // it is a struct definition not an instance
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
        
    }

    // store the Variables
    address public manager;
    uint public minimumContribution;
    // campaign contributers where keys are addresses and values are booleans
    // we will know if someone has donated inside the campaign by looking up thir address
    // inside the mapping and if lookup returns true they have (mapping(address=>bool) approvers
    // default values of booleans are false
    mapping(address => bool) public approvers;
    Request[] public requests; // storage of array of requests
    uint public approversCount;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }
    
    // when contributors want to send money to campaign
    function contribute() public payable {
        require(msg.value > minimumContribution);
        // set value to the key of the contributer as true if they contributed
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    // purpose is to create a new struct of type request and add it to requests array
    // create a new variable of the type Request called newRequest
    function createRequest(string description, uint value, address recipient) public restricted {
        // we use memory as this new variable doesnt point to anything in storage
        // but we use this new variable stored in memory to push to the storage level array of requests
        // no need to reference mapping
        Request memory newRequest = Request({
            description: description,
            value:value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        
        // push new request to requests array
        requests.push(newRequest);
    }
    
    // approve a specific requests
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        
        // is person donator
        require(approvers[msg.sender]);
        
        // has person already voted, if address is already in mapping (so if there is no address continue)
        require(!request.approvals[msg.sender]);
        
        // mark person as voted and increment approval counter;
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    // Finalize index of requests
    function finalizeRequest(uint index) public restricted {
        
        Request storage request = requests[index];
        
        // if 50% + 1 of contributers approve then it is approved
        require(request.approvalCount > (approversCount / 2));
        
        // require request to not be complete
        require(!request.complete);
        
        // send money to recipient
        request.recipient.transfer(request.value);
        
        // mark as complete
        request.complete = true;
    }
    
    function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return ( 
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

}