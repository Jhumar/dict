import React, { useState, useEffect, useRef } from 'react'
import {
  Container,
  Form,
  Row,
  Col,
  Table,
  Button
} from 'react-bootstrap';

import UserNavbar from '../../components/UserNavbar';
import { QueueNumber } from '../../components/QueueNumber';

import { useStateValue } from '../../contexts/StateProvider';

import { GET, POST } from './../../utils/axios';
import { useReactToPrint } from 'react-to-print';

function Guard() {
  const componentRef = useRef(null);
  const [{source}, dispatch] = useStateValue();
  const [windows, setWindows] = useState([]);
  const [type, setType] = useState(null);
  const [queue, setQueue] = useState(null);
  const [queues, setQueues] = useState([]);
  const [selectedWindowId, setSelectedWindowId] = useState(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    removeAfterPrint: true,
    onAfterPrint: () => {
      setQueue(null);
      setSelectedWindowId(null);

      const { request, source } = POST('/queue', {
        window_id: selectedWindowId
      });
  
      dispatch({
        type: 'SET_SOURCE',
        source
      });

      request
        .then(() => {});

      fetchQueues();
    }
  });

  const fetchQueues = () => {
    const { request, source } = GET('/queue');

    dispatch({
      type: 'SET_SOURCE',
      source
    });

    request
      .then((res) => {
        setQueues(res.data.sub);
      });
  };

  const handleTypeOnChange = (e) => {
    setType(e.target.value);
  };

  const handleFormOnSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const window_id = form.window.value;

    const { request, source } = POST('/queue?request=true', {
      window_id
    });

    dispatch({
      type: 'SET_SOURCE',
      source
    });

    form.submit.disabled = true;

    request
      .then((res) => {
        setSelectedWindowId(window_id);
        setQueue(res.data.sub);
      })
      .catch((err) => {
        dispatch({
          type: 'SET_ERROR',
          error: err.response.data.message || err.message
        });
      })
      .finally(() => {
        form.submit.disabled = false;
        form.reset();

        setType(null);
      });
  };

  const fetchWindows = (type) => {
    const { request, source } = GET('/window?type=' + type);

    dispatch({
      type: 'SET_SOURCE',
      source
    });

    request
      .then(res => {
        setWindows([...res.data.sub]);
      });
  };

  useEffect(() => {
    fetchWindows(type);
  }, [type]);

  useEffect(() => {
    fetchQueues();
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
  }, [source]);

  return (
    <>
      <UserNavbar/>

      <Container className='py-5'>
        <Row>
          <Col lg={6}>
            {queue && (
              <div className='d-flex justify-content-center'>
                <div className='mb-4 d-inline-block'>
                  <QueueNumber ref={componentRef} window_name={queue.window_name} number={queue.number} date={queue.date} />
                  <Button className='d-block w-100 btn-lg' onClick={handlePrint}>Print Queue Number</Button>
                </div>
              </div>
            )}

            <Form method='POST' onSubmit={handleFormOnSubmit}>
              <Form.Group className='mb-4'>
                <Form.Label className='fs-5'>Type</Form.Label>
                <Form.Select name='type' size='lg' onChange={handleTypeOnChange} required>
                  <option value='' hidden>Select a type</option>
                  <option value="cashier">Cashier</option>
                  <option value="registrar">Registrar</option>
                  <option value="accounting">Accounting</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className='mb-4'>
                <Form.Label className='fs-5'>Window</Form.Label>
                <Form.Select name='window' size='lg' disabled={!Boolean(type)} required>
                  <option value='' hidden>Select a window</option>
                  { windows.length > 0 && windows.map(window => {
                    return (
                      <option value={window.uuid} key={`key-${window.uuid}`}>{`${window.name}${window.department ? ` - ${window.department}` : ''}`}</option>
                    )
                  }) }
                </Form.Select>
              </Form.Group>

              <Button className='text-end me-2' variant='primary' name='submit' type='submit' size='lg'>
                Generate Queue Number
              </Button>
            </Form>
          </Col>
          <Col lg={6}>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Windows</th>
                  <th>Queue #</th>
                </tr>
              </thead>
              <tbody>
                {queues && queues.length > 0 ? queues.map(queue => (
                  <tr>
                    <td>{queue.window_name}</td>
                    <td>{queue.number}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={2} className='text-center'>No queue available.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Guard