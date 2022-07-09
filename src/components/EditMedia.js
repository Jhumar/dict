import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import { Form, Row, Col, Button } from "react-bootstrap";

import { GET, API_URL, PATCH } from "../utils/axios";
import { useStateValue } from "./../contexts/StateProvider";
import AlertError from "./AlertError";

function EditMedia() {
  const [, dispatch] = useStateValue();

  const params = useParams();
  const { id } = params;

  const [submitting, setSubmitting] = useState(false);

  const [data, setData] = useState({
    name: "",
  });

  const fetchMedia = (id) => {
    const { request } = GET("/media/" + id);

    request.then((res) => {
      setData(res.data.sub);
    });
  };

  useEffect(() => {
    fetchMedia(id);
  }, []);

  const handleEditMedia = (e) => {
    e.preventDefault();

    const { request } = PATCH("/media/" + id, { ...data });

    setSubmitting(true);

    request
      .then((res) => {
        alert(res.data.message);
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

  const handleFormDataOnChange = (e) => {
    setData({
      ...data,
      [e.currentTarget.name]:
        e.currentTarget.type === "file"
          ? e.currentTarget.files[0]
          : e.currentTarget.value,
    });
  };

  return (
    <>
      <h2 className="mb-5">Edit file</h2>
      <AlertError />
      <Form onSubmit={handleEditMedia}>
        {data && data.path && (
          <Row>
            <Col className="mb-3" lg={12}>
              <Form.Label>Preview</Form.Label>
              <div className="text-center">
                {["png", "jpeg", "jpg"].includes(
                  data.path.split(".").pop().toLowerCase()
                ) && (
                  <img
                    src={`${API_URL}/media/${data.uuid}/preview`}
                    className="img-fluid"
                    alt={data.name}
                  />
                )}

                {["mp4", "mpeg"].includes(
                  data.path.split(".").pop().toLowerCase()
                ) && (
                  <video width={720} height={360} controls>
                    <source
                      src={`${API_URL}/media/${data.uuid}/preview`}
                    ></source>
                    Kamote
                  </video>
                )}
              </div>
            </Col>
          </Row>
        )}
        <Row>
          <Col className="mb-3" lg={12}>
            <Form.Group conrtrolId={"formMediaName"}>
              <Form.Label>File name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="E.g File name"
                value={data.name}
                onChange={handleFormDataOnChange}
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

export default EditMedia;
