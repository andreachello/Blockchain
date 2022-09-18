import React, { useState } from 'react'
import { FormGroup, FormControl, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

const ConductTransaction = () => {

    let navigate = useNavigate()	

    const [recipient, setRecipient] = useState("")
    const [amount, setAmount] = useState(0)

    const updateRecipient = (event) => {
        setRecipient(event.target.value)
    }

    const updateAmount = (event) => {
        setAmount(Number(event.target.value))
    }

    const conductTransaction = () => {
        fetch(`${document.location.origin}/api/transact`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ recipient, amount })
        })
        .then((response) => response.json())
        .then(json => {
            alert(json.message || json.type)
            navigate("/transaction-pool")
        })
    }

  return (
    <div className='ConductTransaction App'>
        <Link to="/">Home</Link>
        <h3>Conduct a Transaction</h3>
        <FormGroup>
            <FormControl 
            input="text"
            placeholder='recipient'
            value={recipient}
            onChange={updateRecipient}
            />
        </FormGroup>
        <FormGroup>
        <FormControl 
            input="number"
            placeholder='amount'
            value={amount}
            onChange={updateAmount}
            />
        </FormGroup>
        <div>
            <Button 
            variant="danger"
            onClick={conductTransaction}
            >
                Submit
            </Button>
        </div>
    </div>
  )
}

export default ConductTransaction