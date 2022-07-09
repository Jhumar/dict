import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import {
  FaPencilAlt,
  FaTrashAlt,
  FaSearch,
  FaPlusCircle,
} from "react-icons/fa";

import { Button, Table, Col, InputGroup, FormControl } from "react-bootstrap";

import { Link } from "react-router-dom";
import { useStateValue } from "./../contexts/StateProvider";
import { GET, DELETE } from "../utils/axios";

function MediaList() {
  const [{ source }, dispatch] = useStateValue();

  const [q, setQ] = useState("");
  const [medias, setMedias] = useState([]);

  const fetchMedias = (q = "") => {
    const { request, source } = GET(`/media?q=${q}`);

    dispatch({
      type: "SET_SOURCE",
      source,
    });

    request.then((res) => {
      setMedias(res.data.sub);
    });
  };

  useEffect(() => {
    fetchMedias();
  }, []);

  useEffect(() => {
    fetchMedias(q);
  }, [q]);

  useEffect(() => {
    return () => {
      if (source) {
        source.cancel("Cancelling...");

        dispatch({
          type: "SET_SOURCE",
          source: null,
        });
      }
    };
  }, [source]);

  const handleDeleteMedia = (uuid) => {
    if (window.confirm("Do you want to delete this media?")) {
      const { request, source } = DELETE("/media/" + uuid);

      dispatch({
        type: "SET_SOURCE",
        source,
      });

      request.then((res) => {
        alert(res.data.message);
        fetchMedias();
      });
    }
  };

  return (
    <>
      <Col lg={5} className="d-flex ms-auto mb-3">
        <InputGroup className="me-2">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>

          <FormControl
            placeholder="Search"
            onChange={(e) => setQ(e.target.value)}
            aria-describedby="basic-addon1"
          />
        </InputGroup>

        <Link className="btn btn-primary text-group text-nowrap" to="create">
          <FaPlusCircle className="me-2" />
          Add
        </Link>
      </Col>
      <Table striped>
        <thead>
          <tr>
            <th>Media ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {medias && medias.length > 0 ? (
            medias.map((media) => (
              <tr>
                <td>{media.uuid}</td>
                <td>{media.name}</td>
                <td className="d-flex">
                  <Button
                    as={Link}
                    to={`/admin/media/${media.uuid}/edit`}
                    className="me-2"
                    variant="success"
                  >
                    <FaPencilAlt />
                  </Button>

                  <Button
                    variant="danger"
                    className="me-2"
                    onClick={() => handleDeleteMedia(media.uuid)}
                  >
                    <FaTrashAlt />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center">
                No media available
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}

export default MediaList;
