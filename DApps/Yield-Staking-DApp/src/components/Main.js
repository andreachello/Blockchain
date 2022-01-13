import React, {useState} from 'react'
import tether from '../tether-1.svg'
import Airdrop from './Airdrop'

const Main = (props) => {
        const [input, setInput] = useState()

        const stakeFunction = (event) => {
            event.preventDefault()
            let amount
            amount = input.toString()
            amount = window.web3.utils.toWei(amount, 'Ether')
            props.stakeTokens(amount)
        }

        const unstakeFunction = (event) => {
            event.preventDefault(
            props.unstakeTokens()
            )
        }

        const claim = (event) => {
            event.preventDefault(
                props.claimReward()
                
            )
        }

        return (
            <div id='content' className='mt-5 p-5' style={{backgroundColor: '#424961', borderRadius: '20px'}}>
                <table className='table text-muted text-center' >
                    <thead>
                    <tr style={{color:'white'}}>
                        <th scope='col'>Staking Balance</th>
                        <th scope='col'>Reward Balance</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr style={{color:'white'}}> 
                            <td>{window.web3.utils.fromWei(props.stakingBalance, 'Ether')} USDT</td>
                            <td>{Math.round(window.web3.utils.fromWei(props.rwdBalance, 'Ether'))} RWD</td>
                        </tr>
                    </tbody>
                </table>
                <div className='card mb-2 p-4' style={{opacity:'.9', backgroundColor: '#ffff', borderRadius: '20px'}}>
                    <form 
                    onSubmit={stakeFunction}
                    className='mb-1'>
                        <div style={{borderSpacing:'0 1em'}}>
                            <label className='float-left' style={{marginLeft:'15px'}}><b>Stake Tokens</b></label>
                            <span className='float-right' style={{marginRight:'8px'}}>
                                <b>Balance:</b> {window.web3.utils.fromWei(props.tetherBalance, 'Ether')} USDT
                            </span>
                            <div className='input-group mb-4'>
                                <input
                                type='text'
                                placeholder='0'
                                required 
                                onChange={e => setInput(e.target.value)}/>
                                <div className='input-group-open'>
                                    <div className='input-group-text'>
                                        <img src={tether} alt='tether' height='32' />
                                    </div>
                                </div>
                            </div>
                            <button type='submit' 
                                    className='btn btn-primary btn-lg btn-block'
                                    style={{backgroundColor: '#424961'}}
                                    >
                                Stake
                            </button>
                        </div>
                    </form>
                    <button 
                    style={{backgroundColor: '#424961'}}
                    type='submit'
                    onClick={unstakeFunction}
                    className='btn btn-primary btn-lg btn-block'>Unstake</button>

                    <div className='card-body text-center' style={{color:'blue'}}>
                        <Airdrop 
                            stakingBalance={props.stakingBalance}
                            decentralBankContract={props.decentralBankContract}
                            rewardIssuance={props.rewardIssuance}
                            />
                    </div>
                </div>
            </div>
        )
    }


export default Main;