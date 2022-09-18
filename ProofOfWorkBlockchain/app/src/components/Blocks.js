import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from "react-bootstrap"
import Block from './Block'

const Blocks = () => {
    const [blocks, setBlocks] = useState([])
    const [paginatedId, setPaginatedId] = useState(1)
    const [chainLength, setChainLength] = useState(0)

    // const fetchPaginatedBlocks = (paginatedId) => () => {
    //     fetch(`${document.location.origin}/api/blocks/${paginatedId}`)
    //         .then(resp => resp.json())
    //         .then(json => setChainLength(json))
    // }

    // useEffect(() => {
    //     fetch(`${document.location.origin}/api/blocks/length`)
    //     .then(resp => resp.json())
    //     .then(json => setBlocks(json))

    //     fetchPaginatedBlocks(paginatedId)
    // })

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

        {/* <div>
            {
                // in its own array so we spread the results of calling the object keys in a statically arrays
                // with brackets and use the spread operator to apply each of the keys in the array element
                [...Array(Math.ceil(chainLength / 5 )).keys()].map((key) => {
                    const paginatedId = key + 1

                    return (
                        <span key={key} onClick={() => fetchPaginatedBlocks(paginatedId)}>
                            <Button variant="danger">
                                {paginatedId} 
                            </Button>{' '}
                        </span>
                    )
                })
            }
        </div> */}

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