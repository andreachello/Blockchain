pragma solidity ^0.4.0;


/*

Contract to show the transition of the state of registering for voting

*/

contract StateTransition {
    
    // like enum in python, it is coded as 0, 1, 2, 3
    enum Stage {Init, Reg, Vote, Done}
    Stage public stage;
    uint startTime;
    uint public timeNow;
    
    function StateTransition() public {
        stage = Stage.Init;
        startTime = now;
    }
    
    // assume the stage change has to be enacted approx. every 1 min., the timeNow var is defined for understandning the process
    // we can simply use the solidity defined var "now" 
    // Time duration of stages may vary 
    
    function advanceState() public {
        timeNow = now;
        if (timeNow > (startTime + 10 seconds)) {
            startTime = timeNow;
            if (stage == Stage.Init) {stage = Stage.Reg; return;}
            if (stage == Stage.Reg) {stage = Stage.Vote; return;}
            if (stage == Stage.Vote) {stage = Stage.Done; return;}
            return;
            
        }
    }
    
    
}
