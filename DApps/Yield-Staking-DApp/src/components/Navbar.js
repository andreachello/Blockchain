import React from "react";
import bank from '../bank.png'

const Navbar = (props) => {

    return(
        <nav className='navbar navbar-dark fixed-top shadow p-0' style={{backgroundColor:'#424961', height:'50px'}}>
            <a 
            className='navbar-brand col-sm-3 col-md-2 mr-0'
            style={{color:'white'}}>
            <img src={bank} width='30' height='30' className="d-inline-block align-top" style={{marginRight:"0.5rem"}} alt='icon image'></img>
            Token Staking DApp 
            </a>
            <ul className='navbar-nav px-3'>
                <li className='text-nowrap d-none d-sm-block nav-item'><small style={{color:'white'}}>Wallet Address: {props.account} </small></li>
            </ul>
        </nav>
    )
}

export default Navbar;