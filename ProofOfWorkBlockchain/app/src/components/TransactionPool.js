import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "react-bootstrap"
import Transaction from './Transaction'

const POLL_INTERVAL_MS = 10000

const TransactionPool = () => {

  const navigate = useNavigate()

    const [transactionPoolMap, setTransactionPoolMap] = useState({})

    // fetch all data from transaction pool and display
    const fetchTransactionPoolMap = () => {
        fetch(`${document.location.origin}/api/transaction-pool-map`)
        .then(response => response.json())
        .then(json => setTransactionPoolMap(json))
    }

    useEffect(() => {
        fetchTransactionPoolMap()

        const interval = setInterval(() => {
          fetchTransactionPoolMap()
        }, POLL_INTERVAL_MS)

        return () => {
          clearInterval(interval)
        };
    }, [])

    const fetchMineTransactions = () => {
      fetch(`${document.location.origin}/api/mine-transactions`)
      .then(resp => {
        if (resp.status === 200) {
          alert("Success")
          navigate("/blocks")
        } else {
          alert("The mine-transaction block request did not complete")
        }
      })
    }

  return (
    <div className='TransactionPool App'>
      <div><Link to="/">Home</Link></div> 
        <h3>Transaction Pool</h3>
        {
          Object.values(transactionPoolMap).map(transaction => {
            return (
              <div key={transaction.id}>
                <hr />
                <Transaction transaction={transaction} />
              </div>
            )
          })
        }
        <Button 
        variant="danger"
        onClick={fetchMineTransactions}>
          Mine Transactions
        </Button>
      </div>
  )
}

export default TransactionPool