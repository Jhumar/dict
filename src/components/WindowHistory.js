import React from 'react'

import {
  Table,
  Row,
  Col,
  Button
} from 'react-bootstrap'

function WindowsHistory() {
  return (
    <>
      <Row>
        <Col> 
          <h1 className='mb-5'>Window history</h1>
        </Col>
        <Col className='text-end'>
          <Button variant='primary'>Print</Button>
        </Col>
      </Row>
      <Table striped>
        <thead>
          <tr>
            <th>Date</th>
            <th>Teller</th>
            <th>Queue Number</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Time elapsed</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Date</td>
            <td>Teller</td>
            <td>Queue Number</td>
            <td>Start Time</td>
            <td>End Time</td>
            <td>Time elapsed</td>
          </tr>
        </tbody>
      </Table>
    </>
  )
}

export default WindowsHistory