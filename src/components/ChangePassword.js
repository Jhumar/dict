import React from 'react'

import { Modal, Button, Col, Form, Row } from "react-bootstrap";

function ChangePassword() {
  return (
    <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Office</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleChangePassword}>
          <Modal.Body>
            <Row>
              <Col>
                <Form.Group controlId="addOffice">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="current_password"
                    placeholder="Current Password"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group controlId="addOffice">
                  <Form.Label>New password</Form.Label>
                  <Form.Control
                    type="password"
                    name="new_password"
                    placeholder="New password"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group controlId="addOffice">
                  <Form.Label>Confirm new password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirm_new_password"
                    placeholder="Confirm new password"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
  )
}

export default ChangePassword