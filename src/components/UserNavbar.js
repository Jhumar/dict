import React from 'react'

import { 
  Navbar,
  Dropdown,
  Container
} from 'react-bootstrap'

import { Link } from 'react-router-dom'

import { useStateValue } from '../contexts/StateProvider'

// icons
import { FaAngleDown, FaUserAlt, FaPowerOff } from 'react-icons/fa'

// images
import Logo from '../assets/images/logo.png'
import UserDefaultImage from '../assets/images/account-user.png'

function UserNavbar() {
  const [{user},] = useStateValue();

  return (
    <Navbar className='sticky-top d-flex justify-content-between align-items-center px-3' style={{zIndex: 100}} bg='dark' variant='dark'>
      <Container>
        <Navbar.Brand className='d-flex align-items-center'>
          <img className='me-3' src={Logo} alt="lspu-logo" width={50} height={50}/>
          <div className="d-none d-md-flex flex-column">
            <span className='fs-6'>LAGUNA STATE POLYTECHNIC UNIVERSITY</span>
            <span className='fs-6'>SAN PABLO CITY CAMPUS</span>
          </div>
          <div className="d-block d-md-none">
            <span className="fs-6">LSPU-SPCC</span>
          </div>
        </Navbar.Brand>

        <Dropdown align='end' title='User settings'>
          <Dropdown.Toggle variant='dark' className='d-flex align-items-center' id='dropdown-user-settings'>
            <div className='d-lg-flex align-items-center me-3'>
              <img src={UserDefaultImage} alt="User Default Profile" className='me-0 me-lg-3' width={30} height={30} />
              <p className='d-none d-lg-block m-0'>
                <span className='d-block'>{[user?.first_name, user?.last_name].join(' ')}</span>
                <small className='d-block text-muted text-start'>{user?.role}</small>
              </p>
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>
              <FaUserAlt className='me-3' />
              <span>Profile</span>
            </Dropdown.Item>
            <Dropdown.Item as={Link} to='/logout'>
              <FaPowerOff className='me-3' />
              <span>Logout</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* <span className='d-flex align-items-center text-light'>
          <img src={User} className="" alt="Account User" width={50} />
          <div className="d-flex justify-content-between flex-column mx-3">
            <span className='fs-6'>Jhumar Rosales</span>
            <span className='fs-6'>Teller</span>
          </div>
          <FaAngleDown />
          <div className="mb-2"></div>
        </span> */}
      </Container>
    </Navbar>
  )
}

export default UserNavbar;