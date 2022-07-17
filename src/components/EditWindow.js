import React, { useState, useEffect } from "react";

import { Breadcrumb, Modal, Button, Col, Form, Row } from "react-bootstrap";

import { FaPlus } from "react-icons/fa";
import AlertError from "./AlertError";

import { useStateValue } from "../contexts/StateProvider";

import { GET, PATCH, POST } from "../utils/axios";
import { useParams } from "react-router-dom";

function EditWindow() {
  const params = useParams();
  const { id } = params;

  const [, dispatch] = useStateValue();
  const [hasDepartment, setHasDepartment] = useState(false);
  const [tellers, setTellers] = useState([]);
  const [offices, setOffices] = useState([]);
  const [show, setShow] = useState(false);
  const [sourceToken, setSourceToken] = useState(null);
  const [window, setWindow] = useState({});

  const getWindow = () => {
    const { request } = GET("/window/" + id);

    request.then((res) => setWindow(res.data.sub));
  };

  const getAllTellers = () => {
    const { source, request } = GET("/user?q=TELLER");

    setSourceToken(source);

    request.then((res) => {
      setTellers(res.data.sub);
    });
  };

  const getAllOffices = () => {
    const { source, request } = GET("/office?q=");

    setSourceToken(source);

    request.then((res) => {
      setOffices(res.data.sub);
    });
  };

  const handleCloseModal = () => setShow(false);
  const handalOpenModal = () => setShow(true);

  const handleAddOffice = (e) => {
    e.preventDefault();

    const form = e.target;

    const name = form.office_name.value;

    const { source, request } = POST("/office", {
      name,
    });

    setSourceToken(source);

    form.submit.disabled = true;

    request
      .then((res) => {
        alert(res.data.message);
        form.reset();
        getAllOffices();
      })
      .catch((err) => {
        dispatch({
          type: "SET_ERROR",
          error: err.response.data.message || err.message,
        });
      })
      .finally(() => {
        form.submit.disabled = true;
      });
  };

  const handleFormDataOnChange = (e) => {
    setWindow({
      ...window,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const handleCreateWindow = (e) => {
    e.preventDefault();

    const form = e.target;

    const name = form.name.value;
    const teller_id = form.teller_id.value;
    const department = form.department ? form.department.value : null;
    const office_id = form.office_id.value;

    console.log(department, form.department);

    const { source, request } = PATCH("/window/" + id, {
      name,
      teller_id,
      department,
      office_id,
    });

    setSourceToken(source);

    form.submit.disabled = true;

    request
      .then((res) => {
        alert(res.data.message);
        // form.reset();
      })
      .catch((err) => {
        dispatch({
          type: "SET_ERROR",
          error: err.response.data.message || err.message,
        });
      })
      .finally(() => {
        setHasDepartment(false);
        form.submit.disabled = true;
      });
  };

  useEffect(() => {
    getAllTellers();
    getAllOffices();
    getWindow();
  }, []);

  // Cleans up any request from axios when the view was unmounted
  useEffect(() => {
    // Component did mount,

    return () => {
      // Component did unmount

      if (sourceToken !== null) {
        sourceToken.cancel("Cancelling in cleanup");
      }
    };

    // Component did update
  }, [sourceToken]);

  return (
    <>
      <h1 className="mb-5">Edit window</h1>
      {/* <Breadcrumb className='mb-4'>
        <Breadcrumb.Item href='asd'>asd</Breadcrumb.Item>
        <Breadcrumb.Item href='asd'>asd</Breadcrumb.Item>
        <Breadcrumb.Item href='asd' active>asd</Breadcrumb.Item>
      </Breadcrumb> */}
      <Form onSubmit={handleCreateWindow}>
        <AlertError />
        <Row className="mb-3">
          <Col className="mb-3" lg={6}>
            <Form.Group controlId="formWindowName">
              <Form.Label>Window name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="E.g. Window 1"
                value={window.name}
                onChange={handleFormDataOnChange}
              />
            </Form.Group>
          </Col>

          <Col className="mb-3" lg={6}>
            <Form.Group controlId="formAssignUser">
              <Form.Label>Assign Teller</Form.Label>
              <Form.Select
                name="teller_id"
                value={window.teller_id}
                onChange={handleFormDataOnChange}
                required
              >
                <option value="" selected hidden>
                  Select a teller
                </option>
                {(tellers || []).map((teller) => {
                  return (
                    <option value={teller.uuid}>
                      {teller.first_name} {teller.last_name}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col className="mb-3" lg={6}>
            <Form.Group>
              <Row>
                <Col>
                  <Form.Label>Offices</Form.Label>
                </Col>
                <Col className="text-end">
                  <FaPlus onClick={handalOpenModal} />
                </Col>
              </Row>
              <Form.Select
                name="office_id"
                value={window.office_id}
                onChange={handleFormDataOnChange}
                required
              >
                <option value="" selected hidden>
                  Select a window type
                </option>
                {(offices || []).map((x) => (
                  <option value={x.uuid} key={x.uuid}>
                    {x.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col className="mb-3" lg={6}>
            <Form.Group className="d-flex">
              <Form.Check
                id="has-department"
                className="me-2"
                onChange={() => setHasDepartment(!hasDepartment)}
              />
              <Form.Label for="has-department">Has department?</Form.Label>
            </Form.Group>
            {hasDepartment && (
              <Form.Select
                name="department"
                value={window.department}
                onChange={handleFormDataOnChange}
                required
              >
                <option value="" selected hidden>
                  Select a department
                </option>
                <option value="College of Arts and Science">
                  College of Arts and Science
                </option>
                <option value="College of Business Management and Accountancy">
                  College of Business Management and Accountancy
                </option>
                <option value="College of Computer Studies">
                  College of Computer Studies
                </option>
                <option value="College Of Criminal and Justice Education">
                  College Of Criminal and Justice Education
                </option>
                <option value="College of Industrial Technology">
                  College of Industrial Technology
                </option>
                <option value="College of Hospitality Management and Tourism">
                  College of Hospitality Management and Tourism
                </option>
                <option value="College of Engineering">
                  College of Engineering
                </option>
                <option value="College of Teacher Education/Graduate Studies and Research">
                  College of Teacher Education/Graduate Studies and Research
                </option>
              </Form.Select>
            )}
          </Col>
        </Row>

        <Row className="text-end">
          <Col lg={12}>
            <Button className="me-2 " variant="secondary" type="reset">
              Reset
            </Button>
            <Button variant="primary" name="submit" type="sumbit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>

      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Office</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddOffice}>
          <Modal.Body>
            <Row>
              <Col>
                <Form.Group controlId="addOffice">
                  <Form.Label>Office name</Form.Label>
                  <Form.Control
                    type="text"
                    name="office_name"
                    placeholder="E.g. Registrar"
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
    </>
  );
}

export default EditWindow;
