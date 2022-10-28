import React from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (

        <Navbar sticky='top' bg="dark" variant="dark">
            <Navbar.Brand>Defi</Navbar.Brand>
            <Nav className="me-auto">
                <Link to='/manualTr'> Manual Transfer </Link>
            </Nav>
        </Navbar>

    )
}

export default NavBar