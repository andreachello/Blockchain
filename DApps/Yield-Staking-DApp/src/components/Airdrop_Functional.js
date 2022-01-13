import React, { useState, useEffect} from "react";

const Airdrop = (props) => {

    // Initialize countown once user staked
    const [time, setTime] = useState({})

    const [seconds, setSeconds] = useState(180)

    // this is the equivalent to component Did mount - Wait for the components to load
    useEffect(() => {
        let timeLeftVar = secondsToTime(seconds)
        setTime(timeLeftVar)
        }, []);

    
    const [timer, setTimer] = useState(0);

    const startTimer = () => {
        if(timer == 0) {
            setTimer(setInterval(countdownFunction, 1000))
        }
    }

    const countdownFunction = () => {
        let secs = seconds - 1
        setSeconds(secs)
        setTime(secondsToTime(seconds))

        // stop counting when we hit zero
        if (seconds == 0) {
            clearInterval(timer)
        }
    }

    const secondsToTime = (secs) => {
        let hours, seconds, minutes;
        hours = Math.floor(secs / (60 * 60)) // round down
        
        let minuteDivisor = secs % (60 * 60)
        minutes = Math.floor(minuteDivisor / 60)

        let secondsDivisor = minuteDivisor % 60
        seconds = Math.ceil(secondsDivisor) 

        let obj = {
            'h': hours,
            'm': minutes,
            's': seconds
        }

        return obj
    } 

    const airdropReleaseTokens = async () => {
        let stakingB = props.stakingBalance
        if(stakingB >= '50000000000000000000') {
            startTimer()
            if(timer == 0) {
                props.rewardIssuance()
            }
        }
    }

    airdropReleaseTokens()
    return(
        <>
        <div style={{color:'black'}}>
         {time.m} : {time.s}
         {startTimer()}
        </div>
        </>
    )

}

export default Airdrop;