import React, { useState, useEffect } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'

import AlertError from './AlertError';

import { useStateValue } from '../contexts/StateProvider';

import { GET, PATCH, POST } from '../utils/axios.js';
import { useParams } from 'react-router-dom';

function EditUser() {
  const params = useParams();
  const { id } = params;
  const [, dispatch] = useStateValue();
  const [sourceToken, setSourceToken] = useState(null);
  const [user, setUser] = useState({});

  const handleFormDataOnChange = (e) => {
    setUser({
      ...user,
      [e.currentTarget.name]: e.currentTarget.value
    });
  }

  const handleEditUser = (e) => {
    e.preventDefault();
    
    const form = e.target;

    const first_name = form.first_name.value;
    const last_name = form.last_name.value;
    const employee_id = form.employee_id.value;
    const institutional_email = form.institutional_email.value;
    const sex = form.querySelector('[name="sex"]:checked').value;
    const role = form.role.value;

    const { request, source } = PATCH('/user/' + id, {
      first_name,
      last_name,
      employee_id,
      institutional_email,
      sex,
      role
    });

    setSourceToken(source);

    form.submit.disabled = true;

    request
      .then((res => {
        alert(res.data.message);
        // form.reset();
      }))
      .catch((err) => {
        dispatch({
          type: 'SET_ERROR',
          error: err.response.data.message || err.message
        })
      })
      .finally(() => {
        form.submit.disabled = false;
      })
  }

  const fetchUser = function() {
    const { request, source } = GET('/user/' + id);

    request.then(res => setUser(res.data.sub));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Cleans up any request from axios when the view was unmounted
  useEffect(() => {
    // Component did mount,
    
    return () => {
      // Component did unmount

      if (sourceToken !== null) {
        sourceToken.cancel('Cancelling in cleanup');
      }
    }
    
    // Component did update
  }, [sourceToken])

  return (
    <>
      <h1 className='mb-5'>Edit user</h1>
      <Form onSubmit={handleEditUser}>
        <AlertError />
        <Row className='mb-3'>
          <Col lg={12}>
            <Form.Group controlId='formUserFirstname'>
              <Form.Label>Change profile picture</Form.Label>
              <Form.Control type='file'/>
            </Form.Group>
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col lg={12}>
            <Form.Group controlId='formUserId'>
              <Form.Label>Employee ID</Form.Label>
              <Form.Control 
                type='text'
                name='employee_id'
                placeholder='Employee ID (0000-0000)'
                value={user.employee_id}
                onChange={handleFormDataOnChange}
                required
                />
            </Form.Group>
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col lg={6}>
            <Form.Group controlId='formUserFirstname'>
              <Form.Label>First name</Form.Label>
              <Form.Control 
                type='text' 
                name='first_name'
                placeholder='E.g John'
                value={user.first_name}
                onChange={handleFormDataOnChange}
                required
              />
            </Form.Group>
          </Col>

          <Col lg={6}>
            <Form.Group controlId='formLastname'>
              <Form.Label>Last name</Form.Label>
              <Form.Control 
                type='text' 
                name='last_name'
                placeholder='E.g Joe'
                value={user.last_name}
                onChange={handleFormDataOnChange}
                required
              /> 
            </Form.Group>
          </Col>
        </Row>

        <Row className='mb-3'>
          <Col lg={6}>
            <Form.Group controlId='formUserGender'>
              <Form.Label>Gender</Form.Label>
              <div className="d-flex">
                {['Male', 'Female'].map((s, i) => (
                  <>
                    <Form.Check 
                      className='me-3'
                      type='radio'
                      label={s}
                      name="sex"
                      value={s.toUpperCase()}
                      id={s}
                      key={i}
                      checked={user.sex === s.toUpperCase()}
                      onChange={handleFormDataOnChange}
                    />
                  </>
                ))}
              </div>
            </Form.Group>
          </Col>
          <Col lg={6}>
            <Form.Group controlId='formUserEmail'>
              <Form.Label>Institution Email</Form.Label>
              <Form.Control 
                type='email'
                name='institutional_email' 
                placeholder='0000-0000@lspu.edu.ph' 
                value={user.institutional_email}
                onChange={handleFormDataOnChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className='mb-3'>
          <Col lg={6}>
            <Form.Group controlId='formUserType'>
              <Form.Label>User type</Form.Label>
              <Form.Select name='role' value={user.role} onChange={handleFormDataOnChange} required>
                <option value=''>Select user type</option>
                <option value='ADMIN'>Admin</option>
                <option value='GUARD'>Guard</option>
                <option value='TELLER'>Teller</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className='text-end'>
          <Col lg={12}>
            <Button className='text-end me-2' variant='secondary' type='reset'>
              Cancel
            </Button>

            <Button className='text-end' name='submit' variant='primary' type='submit'>
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default EditUser