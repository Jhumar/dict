import React, { useState, useEffect } from 'react'
import { Navbar } from 'react-bootstrap';

// images
import logo from '../assets/images/logo.png'


const monthLabel = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];

const dayLabel = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const current = new Date();
const day = `${dayLabel[current.getDay()]}`
const date = `${monthLabel[current.getMonth()]} ${current.getDate()}, ${current.getFullYear()}`;

//components

function ViewingNavbar() {

  const [time, setTime] = useState(new Date());

  useEffect( () => {
    const timer = setInterval(() => setTime(new Date()), 1000)

    return function cleanup() {
      clearInterval(timer)
    }
  },[]); 

  return (
    <Navbar className="sticky-top d-flex justify-content-between" bg="dark" variant='dark'>
      <Navbar.Brand className="d-flex align-items-center px-3">
        <img className="me-3" src={logo} width="55" height="55" alt='LSPU-LOGO' />
        <div className="d-flex flex-column">
          <span className='fs-5'>LAGUNA STATE POLYTECHNIC UNIVERSITY</span>
          <span className='fs-5'>SAN PABLO CITY CAMPUS</span>
        </div>
      </Navbar.Brand>

      <Navbar.Brand className="d-flex align-items-center px-3">
        <div className="d-flex flex-column align-items-end">
          <div className="date-time-wrapper">
            <span className='fs-5'>{`${day}, ${time.toLocaleTimeString()}`}</span>
          </div>
          <div className="date">
            {/* <p>{document.write(`${monthLabel[current.getMonth()]}`)}</p> */}
            <span className='fs-5'>{date}</span>
          </div>
        </div>
      </Navbar.Brand>
    </Navbar>
  )
}

export default ViewingNavbar;