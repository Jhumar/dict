import React, { useState, useEffect } from 'react'

import { Breadcrumb, Button, Col, Form, Row} from 'react-bootstrap'

import AlertError from './../components/AlertError';

import { useStateValue } from './../contexts/StateProvider';

import { GET, POST } from '../utils/axios';

function CreateWindow() {
  const [, dispatch] = useStateValue();
  const [hasDepartment, setHasDepartment] = useState(false);
  const [tellers, setTellers] = useState([]);
  const [sourceToken, setSourceToken] = useState(null);

  const getAllTellers = () => {
    const { source, request } = GET('/user?q=TELLER');

    setSourceToken(source);

    request
      .then(res => {
        setTellers(res.data.sub);
      });
  };

  const handleCreateWindow = (e) => {
    e.preventDefault();

    const form = e.target;
    
    const name = form.name.value;
    const teller_id = form.teller_id.value;
    const department = form.department ? form.department.value : null;
    const type = form.type.value;

    console.log(department, form.department)

    const { source, request } = POST('/window', {
      name,
      teller_id,
      department,
      type
    });

    setSourceToken(source);

    form.submit.disabled = true;

    request
      .then((res) => {
        alert(res.data.message);
        form.reset();
      })
      .catch(err => {
        dispatch({
          type: 'SET_ERROR',
          error: err.response.data.message || err.message
        })
      })
      .finally(() => {
        setHasDepartment(false);
        form.submit.disabled = true;
      })
  };

  useEffect(() => {
    getAllTellers();
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
  }, [sourceToken]);

  return (
    <>
      <h2 className='mb-5'>Add window</h2>
      {/* <Breadcrumb className='mb-4'>
        <Breadcrumb.Item href='asd'>asd</Breadcrumb.Item>
        <Breadcrumb.Item href='asd'>asd</Breadcrumb.Item>
        <Breadcrumb.Item href='asd' active>asd</Breadcrumb.Item>
      </Breadcrumb> */}
      <Form onSubmit={handleCreateWindow}>
        <AlertError />
        <Row className='mb-3'>
          <Col className='mb-3' lg={6}>
            <Form.Group controlId='formWindowName'>
              <Form.Label>Window name</Form.Label>
              <Form.Control type='text' name='name' placeholder='E.g. Window 1'/>
            </Form.Group>
          </Col>

          <Col className='mb-3' lg={6}>
            <Form.Group controlId='formAssignUser'>
              <Form.Label>Assign Teller</Form.Label>
              <Form.Select name='teller_id' required>
                <option value="" selected hidden>Select a teller</option>
                {(tellers || []).map((teller) => {
                  return (
                    <option value={teller.uuid}>{teller.first_name} {teller.last_name}</option>
                  )
                })}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col className='mb-3' lg={6}>
            <Form.Group>
              <Form.Label>Window type</Form.Label>
              <Form.Select name='type' required>
                <option value="" selected hidden>Select a window type</option>
                <option value="cashier">Cashier</option>
                <option value="registrar">Registrar</option>
                <option value="accounting">Accounting</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col className='mb-3' lg={6}>
            <Form.Group className='d-flex'>
              <Form.Check id='has-department' className='me-2' onChange={() => setHasDepartment(!hasDepartment)} />
              <Form.Label for='has-department'>Has department?</Form.Label>
            </Form.Group>
            {hasDepartment && (
              <Form.Select name='department' required>
                <option value='' selected hidden>Select a department</option>
                <option value='College of Arts and Science'>College of Arts and Science</option>
                <option value='College of Business Management and Accountancy'>College of Business Management and Accountancy</option>
                <option value='College of Computer Studies'>College of Computer Studies</option>
                <option value='College Of Criminal and Justice Education'>College Of Criminal and Justice Education</option>
                <option value='College of Industrial Technology'>College of Industrial Technology</option>
                <option value='College of Hospitality Management and Tourism'>College of Hospitality Management and Tourism</option>
                <option value="College of Engineering">College of Engineering</option>
                <option value="College of Teacher Education/Graduate Studies and Research">College of Teacher Education/Graduate Studies and Research</option>
              </Form.Select>
            )}
          </Col>
        </Row>

        <Row className='text-end'>
          <Col lg={12}>
            <Button className='me-2 ' variant='secondary' type='reset'>Reset</Button>
            <Button variant='primary' name='submit' type='sumbit'>Submit</Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default CreateWindow