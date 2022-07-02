import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { 
  Container, 
  Form,
  Button,
  Col
} from 'react-bootstrap';

import AlertError from './../components/AlertError';

import { useStateValue } from './../contexts/StateProvider';

import { POST } from '../utils/axios.js';

import logo from '../assets/images/logo.png'

function Login() {
  const navigate = useNavigate();
  const [, dispatch] = useStateValue();

  const [sourceToken, setSourceToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const employee_id = form.employee_id.value;
    const password = form.password.value;

    const { request, source } = POST('/login', {
      employee_id,
      password
    });

    // Update the sourceToken with the given token
    // from the request so we can cancel it when needed
    setSourceToken(source);
    
    form.submit.disabled = true;

    request
      .then((res) => {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('access_token', res.data.credentials.access_token);
        localStorage.setItem('refresh_token', res.data.credentials.refresh_token);

        dispatch({
          type: 'SET_USER',
          user: res.data.user
        });

        if (['SUPERADMIN', 'ADMIN'].includes(res.data.user.role)) {
          navigate('/admin', { replace: true });
        }
        else if (res.data.user.role === 'TELLER') {
          navigate('/teller', { replace: true });
        }
        else if (res.data.user.role === 'GUARD') {
          navigate('/guard', { replace: true });
        }
        else {
          dispatch({
            type: 'SET_ERROR',
            error: 'Cannot process your login.'
          });

          navigate('/logout', { replace: true });
        }
      })
      .catch((err) => {
        dispatch({ 
          type: 'SET_ERROR', 
          error: err.response.data.message || err.message
        });
      })
      .finally(() => {
        form.submit.disabled = false;
      });
  };

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
    <Container fluid className='d-flex justify-content-center align-items-center vh-100 bg-dark'>
      <Col md={4} lg={3}>
        <Form className='bg-light p-4 rounded' onSubmit={handleSubmit}>

          <div className="d-flex flex-column align-items-center">
            <img src={logo} className="mb-3" alt="LSPU logo" width={70}/>
            <h1 className='fs-4'>Queuing System</h1>
            <span className='text-secondary mb-3'>San Pablo City Campus</span>
          </div>

          <AlertError />
          
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Employee ID</Form.Label>
            <Form.Control name="employee_id" type="text" placeholder="Employee ID" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control name="password" type="password" placeholder="Password" />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button type="submit" name="submit" variant="primary">
              Sign in
            </Button>
          </div>
          {/* <Button variant="primary" type="submit">
            Sign in
          </Button> */}
        </Form>
      </Col>
    </Container>
  )
}

export default Login;