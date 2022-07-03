import React, { useState, useEffect } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'

import AlertError from './../components/AlertError';

import { useStateValue } from './../contexts/StateProvider';

import { POST } from '../utils/axios.js';

function CreateUser() {
  const [, dispatch] = useStateValue();
  const [sourceToken, setSourceToken] = useState(null);

  const handleCreateUser = (e) => {
    e.preventDefault();
    
    const form = e.target;

    const first_name = form.first_name.value;
    const last_name = form.last_name.value;
    const employee_id = form.employee_id.value;
    const institutional_email = form.institutional_email.value;
    const sex = form.querySelector('[name="sex"]:checked').value;
    const role = form.role.value;

    const { request, source } = POST('/user', {
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
        form.reset();
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
      <h2 className='mb-5'>Add user</h2>
      <Form onSubmit={handleCreateUser}>
        <AlertError />
        <Row className='mb-3'>
          <Col lg={12}>
            <Form.Group controlId='formUserPicture'>
              <Form.Label>Profile picture</Form.Label>
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
                <Form.Check 
                  className='me-3'
                  type='radio'
                  label='Male'
                  name='sex'
                  value='MALE'
                  id='male'
                  checked
                />

                <Form.Check 
                  type='radio'
                  label='Female'
                  name='sex'
                  value='FEMALE'
                  id='sex'
                />
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
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className='mb-3'>
          <Col lg={6}>
            <Form.Group controlId='formUserType'>
              <Form.Label>User type</Form.Label>
              <Form.Select name='role' required>
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

export default CreateUser