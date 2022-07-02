import React, { useState, useEffect } from 'react'
import { Button, Col, FormControl, InputGroup, Table } from 'react-bootstrap'
import { FaPlusCircle, FaSearch, FaPencilAlt, FaTrashAlt, FaHistory} from 'react-icons/fa'

import { Link } from 'react-router-dom'

import UserDefaultImage from '../assets/images/account-user.png';

import { useStateValue } from './../contexts/StateProvider';

import { DELETE, GET } from '../utils/axios.js';

function UsersList() {
  const [{source}, dispatch] = useStateValue();

  const [users, setUsers] = useState([]);

  const fetchUsers = (q = '') => {
    const { request, source } = GET('/user?q=' + q);

    dispatch({
      type: 'SET_SOURCE',
      source
    });

    request
      .then((res) => {
        setUsers(res.data.sub);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {    
    return () => {
      if (source) {
        source.cancel('Cancelling...');

        dispatch({
          type: 'SET_SOURCE',
          source: null
        });
      }
    };
  }, [source])

  const handleDeleteUser = (uuid) => {
    if(window.confirm('Do you want to delete this user?')) {
      const { request, source } = DELETE('/user/' + uuid);

      dispatch({
        type: 'SET_SOURCE',
        source
      });
  
      request
        .then((res) => {
          alert(res.data.message);
          fetchUsers();
        });    
    }
  }

  return (
    <>

      <Col lg={5} className='d-flex ms-auto mb-3'>
        <InputGroup className='me-2'>
          <InputGroup.Text>
            <FaSearch/>
          </InputGroup.Text>

          <FormControl 
            placeholder='Search'
            aria-describedby="basic-addon1"
          />
        </InputGroup>

        <Link className='btn btn-primary text-nowrap' to='create'>
          <FaPlusCircle className='me-2'/>
          Add
        </Link>
      </Col>
      <Table striped>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Sex</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? users.map(user => (
              <tr>
                <td>{user.employee_id}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <img className='me-2' src={UserDefaultImage} width={40} height={40} alt="user pic " />
                    {user.first_name} {user.last_name}
                  </div>
                </td>
                <td>{user.sex ?? '--'}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  <div className="d-flex">
                    <Button as={Link} to={`/admin/user/${user.uuid}`} className='me-2' variant='success'>
                      <FaPencilAlt/>
                    </Button>

                    <Button variant='danger' className='me-2' onClick={() => handleDeleteUser(user.uuid)}>
                      <FaTrashAlt/>
                    </Button>

                    <Button as={Link} to={`/admin/user/${user.uuid}/history`} variant='secondary' disabled={user.role !== 'TELLER'}>
                      <FaHistory/>
                    </Button>
                  </div>
                </td>
              </tr>
          )) : (
            <tr>
              <td colSpan={6} className='text-center'>No user available</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  )
}

export default UsersList