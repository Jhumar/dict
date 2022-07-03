import React from 'react'

import {
  FaPencilAlt,
  FaTrashAlt,
  FaSearch,
  FaPlusCircle,
} from "react-icons/fa";

import { 
  Button, 
  Table,
  Col, 
  InputGroup, 
  FormControl
} from "react-bootstrap";

import { Link } from "react-router-dom";

function MediaList() {
  const handleDeleteMedia = () => {
    console.log('asd')
  }

  return (
    <>
      <Col lg={5} className="d-flex ms-auto mb-3">
        <InputGroup className="me-2">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>

          <FormControl placeholder="Search" aria-describedby="basic-addon1" />
        </InputGroup>

        <Link className="btn btn-primary text-group text-nowrap" to="create">
          <FaPlusCircle className="me-2" />
          Add
        </Link>
      </Col>
      <Table striped>
        <thead>
          <tr>
            <th>File</th>
            <th>File name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td></td>
            <td>Title</td>
            <td className="d-flex">
              <Button
                as={Link}
                to={'/admin/media/edit'}
                className="me-2"
                variant="success"
              >
                <FaPencilAlt />
              </Button>

              <Button
                variant="danger"
                className="me-2"
                onClick={() => handleDeleteMedia(window.uuid)}
              >
                <FaTrashAlt />
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  )
}

export default MediaList