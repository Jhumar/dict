import React, { useState, useEffect } from 'react'

import { FaPencilAlt, FaTrashAlt, FaSearch, FaPlusCircle} from 'react-icons/fa'

import { Col, InputGroup, FormControl } from 'react-bootstrap';

import { Button, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom';


import { DELETE, GET } from '../utils/axios.js';

function WindowsList() {
  const [windows, setWindows] = useState([]);
  const [sourceToken, setSourceToken] = useState(null);

  const fetchWindows = (q = '') => {
    const { request, source } = GET('/window?q=' + q + '&with_teller=true');

    setSourceToken(source);

    request
      .then((res) => {
        setWindows(res.data.sub);
      });
  };

  useEffect(() => {
    fetchWindows();
  }, []);

  useEffect(() => {    
    return () => {
      if (sourceToken) {
        sourceToken.cancel('Cancelling...');
      }
    };
  }, [sourceToken]);

  const handleDeleteWindow = (uuid) => {
    if(window.confirm('Do you want to delete this window?')) {
      const { request } = DELETE('/window/' + uuid);

      request
        .then((res) => {
          alert(res.data.message);
          fetchWindows();
        });   
    }
  }
  return (
    <>  

      <Col lg={5} className='d-flex ms-auto mb-3'>
        <InputGroup className='me-2'>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>

          <FormControl
            placeholder='Search'
            aria-describedby="basic-addon1"
          />
        </InputGroup>

        <Link className='btn btn-primary text-group text-nowrap' to='create'>
          <FaPlusCircle className='me-2'/>
          Add
        </Link>
      </Col>

      <Table striped>
        <thead>
          <tr>
            <th>Windows name</th>
            <th>Assigned Teller</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {windows && windows.length > 0 ? windows.map(window => (
            <tr>
              <td>{window.name}</td>
              <td>{window.teller ? [window.teller.first_name, window.teller.last_name].join(' ') : '-'}</td>
              <td>{window.department ? [window.department].join(' ') : '-'}</td>
              <td className='d-flex'>
                <Button as={Link} to={`/admin/windows/${window.uuid}`} className='me-2' variant='success'>
                  <FaPencilAlt/>
                </Button>

                <Button variant='danger' onClick={() => handleDeleteWindow(window.uuid)}>
                  <FaTrashAlt/>
                </Button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={3} className='text-center'>No windows available</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  )
}

export default WindowsList