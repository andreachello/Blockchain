import {useEffect, useState} from "react"
import { Link } from 'react-router-dom'
import './App.css';

function App() {

  const [walletInfo, setWalletInfo] = useState({})

  useEffect(() => {
    fetch(`${document.location.origin}/api/wallet-info`) 
      .then((resp) => resp.json())
      .then(json => setWalletInfo(json))
  }, [])

  return (
    <div className="App">
      <div><h1>Welcome to the blockchain</h1></div>
      <br />
      <div><Link to="/blocks">Blocks</Link></div>
      <div><Link to="/conduct-transaction">Conduct a Transaction</Link></div>
      <div><Link to="/transaction-pool">Transaction Pool</Link></div>
      <div className="WalletInfo">
        <div>address: {walletInfo.address}</div>
        <div>balance: {walletInfo.balance}</div>
      </div>
    </div>
  );
}

export default App;
