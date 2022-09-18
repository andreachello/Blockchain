import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Transaction from './Transaction'

const Block = ({timestamp, hash, data}) => {

    const [displayTransaction, setDisplayTransaction] = useState(false)
    const hashDisplay = `${hash.substring(0,15)}...`
    const toggleTransaction = () => {
        setDisplayTransaction(!displayTransaction)
    }

    const displayEntireTransaction = () => {

        const stringifiedData = JSON.stringify(data)
        const dataDisplay = stringifiedData.length > 35 ? `${stringifiedData.substring(0,35)}...` : stringifiedData
        
        if (displayTransaction) {
            return (
                <div >
                    <div>
                        {
                            data.map(transaction => (
                                <div key={transaction.id}>
                                    <hr />
                                    <Transaction transaction={transaction} />
                                </div>
                            ))
                        }
                    </div>
                    <Button variant="danger" onClick={toggleTransaction}>Show Less</Button>
                </div>
            )
        }
        
        return (
            <div>
                <div>Data: {dataDisplay}</div>
                <Button variant="danger" onClick={toggleTransaction}>Show More</Button>
            </div>
        )
    }

    return (
    <div className='Block'>
        <div>Hash: {hashDisplay}</div>
        <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
        {displayEntireTransaction()}
    </div>
  )
}

export default Block