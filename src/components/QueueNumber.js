import React from 'react';
import {
  Card
} from 'react-bootstrap';

export const QueueNumber = React.forwardRef(({window_name, number, date}, ref) => {
  return (
    <Card ref={ref} style={{ width: '18rem' }} className='mb-3'>
      <Card.Body className="text-center">
        <Card.Text>
          <span className='d-block fs-5'>{window_name}</span>
          <span className='h1 text-dark border border-3 border-dark rounded my-3 p-5 d-inline-block'>
            {number}
          </span>
          <br />
          <span className='fs-5'>{date}</span>
        </Card.Text>
      </Card.Body>
    </Card>
  );
});