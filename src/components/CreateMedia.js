import React, { useState } from "react";

import { Form, Row, Col, Button } from "react-bootstrap";

import { POST } from "../utils/axios";
import { useStateValue } from "./../contexts/StateProvider";
import AlertError from "./AlertError";

function CreateMedia() {
  const [, dispatch] = useStateValue();

  const [submitting, setSubmitting] = useState(false);

  const [data, setData] = useState({
    name: "",
    file: null,
  });

  const handleFormDataOnChange = (e) => {
    setData({
      ...data,
      [e.currentTarget.name]:
        e.currentTarget.type === "file"
          ? e.currentTarget.files[0]
          : e.currentTarget.value,
    });
  };

  const handleCreateMedia = (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    const { request } = POST("/media", formData);

    setSubmitting(true);

    request
      .then((res) => {
        alert(res.data.message);
        e.target.reset();
      })
      .catch((err) => {
        dispatch({
          type: "SET_ERROR",
          error: err.response.data.message || err.message,
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <h2 className="mb-5">Add file</h2>
      <AlertError />
      <Form onSubmit={handleCreateMedia}>
        <Row>
          <Col className="mb-3" lg={12}>
            <Form.Group controlId="formMediaFile">
              <Form.Label>File</Form.Label>
              <Form.Control
                type="file"
                name="file"
                onChange={handleFormDataOnChange}
                accept="image/jpeg,image/jpg,image/png,video/mp4,video/mpeg"
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col className="mb-3" lg={12}>
            <Form.Group conrtrolId={"formMediaName"}>
              <Form.Label>File name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="E.g File name"
                onChange={handleFormDataOnChange}
                value={data.name}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="text-end">
          <Col lg="12">
            <Button className="me-2" variant="secondary" type="reset">
              Cancel
            </Button>
            <Button variant="primary" disabled={submitting} type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default CreateMedia;
