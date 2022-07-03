import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'


import {
  Button,
  Col,
  Row,
  Table
} from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import { GET } from '../utils/axios';

function UserHistory() {
  const params = useParams();
  const { id } = params;

  const [history, setHistory] = useState([]);

  const fetchHistory = () => {
    const { request } = GET('/queue/' + id + '/history');

    request.then(res => setHistory(res.data.sub));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <>
      <Row>
        <Col>
          <h1 className='mb-5'>User History</h1>
        </Col>
        <Col className='text-end'>
          <Button variant='primary'>Print</Button>
        </Col>
      </Row>
      <Table striped>
        <thead>
          <tr>
            <th>Date</th>
            <th>Queue Number</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Time elapsed</th>
          </tr>
        </thead>
        <tbody>
          {(
            history.length > 0
              ? history.map(h => (
                <tr>
                  <td>{h.date}</td>
                  <td>{h.number}</td>
                  <td>{h.start_time}</td>
                  <td>{h.end_time}</td>
                  <td>{h.time_elapsed} secs</td>
                </tr>
              ))
              : (
                <tr>
                  <td colSpan={5} className='text-center'>No data available</td>
                </tr>
              )
          )}
        </tbody>
      </Table>
    </>
  )
}

export default UserHistory