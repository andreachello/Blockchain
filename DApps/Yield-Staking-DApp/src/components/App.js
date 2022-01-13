import React, { useEffect } from "react";
import './App.css'
import Navbar from './Navbar'
import Main from './Main'
import { useState } from "react";
import Web3 from "web3";

// import smart contract ABIs
import Tether from '../truffle_abis/Tether.json'
import Reward from '../truffle_abis/Reward.json'
import DecentralBank from '../truffle_abis/DecentralBank.json'

const App = () => {

    const [account, setAccount] = useState('')
    const [tetherToken, setTetherToken] = useState({})
    const [rwdToken, setRWDToken] = useState({})
    const [decentralBank, setDecentralBank] = useState({})
    const [tetherBalance, setTetherBalance] = useState('0')
    const [rwdBalance, setRWDBalance] = useState('0')
    const [stakingBalance, setStakingBalance] = useState('0')
    const [loading, setLoading] = useState(true)

    // this is the equivalent to component Will mount
    useEffect(() => {
       (async () => {
        await loadWeb3()
        await loadBlockchainData()
       })()
      }, []);

    const loadBlockchainData = async () => {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        setAccount(accounts[0])
        
        const networkId = await web3.eth.net.getId()

        // Load Tether contract
        const tetherData = Tether.networks[networkId]
        if (tetherData) {
            const tether = new web3.eth.Contract(Tether.abi, tetherData.address)
            setTetherToken(tether)

            let tetherBalance = await tether.methods.balanceOf(accounts[0]).call()
            setTetherBalance(tetherBalance.toString())

        } else {
            window.alert('Error! Tether contract not deployed - no detected network!')
        }

         // Load Reward contract
         const rwdData = Reward.networks[networkId]
         if (rwdData) {
             const rwd = new web3.eth.Contract(Reward.abi, rwdData.address)
             setRWDToken(rwd)
 
             let rwdBalance = await rwd.methods.balanceOf(accounts[0]).call()
             setRWDBalance(rwdBalance.toString())
 
         } else {
             window.alert('Error! Reward contract not deployed - no detected network!')
         }

         // Load DecentralBank contract
         const decentralBankData = DecentralBank.networks[networkId]
         if (decentralBankData) {
             const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
             setDecentralBank(decentralBank)
 
             let decentralBankBalance = await decentralBank.methods.stakingBalance(accounts[0]).call()
             setStakingBalance(decentralBankBalance.toString())
 
         } else {
             window.alert('Error! DecentralBank contract not deployed - no detected network!')
         }

         setLoading(false)
    }

    const loadWeb3 = async () => {
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('Need to install Metamask')
        }
    } 

    // Staking and unstaking functions
    const stakeTokens = async (amount) => {
        setLoading(true)
       await tetherToken.methods
            .approve(decentralBank._address, amount)
            .send({from: account})
        await decentralBank.methods
            .depositTokens(amount)
            .send({from: account})
        // change loading state
        setLoading(false)
    }

    const unstakeTokens = () => {
        setLoading(true)
        decentralBank.methods.unstakeTokens()
        .send({from: account}).on('transactionHash', (hash) => {
            // change loading state
            setLoading(false)
        })
    }

    const rewardIssuance = async () => {
        setLoading(true)
        
        await decentralBank.methods.issueTokens()
        setLoading(false)

    }

    const claimReward = async () => {
        await rwdToken.methods
        .send({from: decentralBank._address}, rwdBalance)
        
        
    }

    // Load Content of Main
    let content;
    {
        loading ? 
        content = <p id='loader' className='text-center' style={{margin:'30px'}}>Loading</p>
        : content = 
            <Main 
                tetherBalance={tetherBalance}
                rwdBalance={rwdBalance}
                stakingBalance={stakingBalance}
                stakeTokens = {stakeTokens}
                unstakeTokens = {unstakeTokens}
                rewardIssuance = {rewardIssuance}
                claimReward = {claimReward}
            />
    }

    return(
        <>
        <Navbar account={account} setAccount={setAccount}/>
        <div className='container-fluid mt-5'>
            <div className='row'>
                <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth:'600px', minHeight:'100vm'}}>
                    <div>
                        {content}
                    </div>
                </main>
            </div>
        </div>
        </>
    )
}

export default App;