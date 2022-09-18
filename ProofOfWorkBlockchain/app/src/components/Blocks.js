import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Block from './Block'

const Blocks = () => {
    const [blocks, setBlocks] = useState([])

    useEffect(() => {
        fetch(`${document.location.origin}/api/blocks`)
            .then(resp => resp.json())
            .then(json => setBlocks(json))
    })

  return (
    <div className='App' style={{marginTop: "2rem"}}>
        <div>
            <Link to="/">Home</Link>
        </div>
        <h3>Blocks</h3>

        {blocks.map(block => {
            return (
               <>
                <Block 
                key={block.hash}
                hash={block.hash}
                timestamp={block.timestamp}
                data={block.data}
                />
               </>
            )
        })}
    </div>
  )
}

export default Blocks