import React from 'react'
import { Navbar } from 'react-bootstrap';

// images
import logo from '../assets/images/logo.png'

//components

function ViewingNavbar() {
  return (
    <Navbar className="sticky-top" bg="dark" variant='dark'>
      <Navbar.Brand className="d-flex align-items-center px-3">
        <img className="me-3" src={logo} width="50" height="50" alt='LSPU-LOGO' />
        <div className="d-flex flex-column">
          <span className='fs-6'>LAGUNA STATE POLYTECHNIC UNIVERSITY</span>
          <span className='fs-6'>SAN PABLO CITY CAMPUS</span>
        </div>
      </Navbar.Brand>
    </Navbar>
  )
}

export default ViewingNavbar;