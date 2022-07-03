import React from 'react'

import {
  Form,
  Row,
  Col,
  Button
} from 'react-bootstrap'

function CreateMedia() {

  const handleCreateMedia = () => {
    console.log('asdasd')
  }

  return (
    <>
      <h2 className='mb-5'>Add file</h2>
      <Form on={handleCreateMedia}>
        <Row>
          <Col className='mb-3' lg={12}>
            <Form.Group controlId='formMediaFile'>
              <Form.Label>File</Form.Label>
              <Form.Control 
                type='file'
                name='media'
                required
                />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col className='mb-3' lg={12}>
            <Form.Group conrtrolId={'formMediaName'}>
              <Form.Label>File name</Form.Label>
              <Form.Control
                type='text'
                name="file_name"
                placeholder='E.g File name'
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className='text-end'>
          <Col lg='12'>
            <Button className='me-2' variant='secondary' type='reset'>Cancel</Button>
            <Button variant='primary' type='submit'>Submit</Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default CreateMedia