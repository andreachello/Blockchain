import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

  // this statement is taking place inside the constructor after compiling trhough babbel
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: "",
  };

  async componentDidMount() {
    // default account is already specified in metamask
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();
  
    // get list of accounts
    const accounts = await web3.eth.getAccounts();
    
    // message to tell users what is happening
    this.setState({message: "Waiting on transaction success..."})
    
    // enter lottery
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });

    this.setState({message: "You have been entered!"})
  };

  onClick = async () => {

    // get list of accounts
    const accounts = await web3.eth.getAccounts();
    
    // message to tell users what is happening
    this.setState({message: "Waiting on transaction success..."})

    await lottery.methods.pickWinner().send({
        from: accounts[0]
    });
    
    this.setState({message: "A winner has been picked!"})

  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}.</p>
        
        <p>There are currently {this.state.players.length} people entered, competing to win {web3.utils.fromWei(this.state.balance, 'ether')} Ether.</p>
        <hr/>
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            
            <input 
            value = {this.state.value}
            onChange={event => this.setState({ value: event.target.value})}>

            </input>
            <button>Enter</button>
          </div>
        </form>
        <hr/>
        <h1>{this.state.message}</h1>
        <hr/>
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a Winner!</button>
        <hr/>
      </div>
    );
  }
}

export default App;
