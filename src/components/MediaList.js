import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import {
  FaPencilAlt,
  FaTrashAlt,
  FaSearch,
  FaPlusCircle,
  FaEllipsisV,
  FaAlignCenter,
} from "react-icons/fa";

import {
  Button,
  Row,
  Table,
  Col,
  InputGroup,
  FormControl,
  Form,
} from "react-bootstrap";
import BootstrapSwitchButton from "bootstrap-switch-button-react";

import { Link } from "react-router-dom";
import { useStateValue } from "./../contexts/StateProvider";
import { GET, DELETE, PATCH } from "../utils/axios";

function MediaList() {
  const [{ source }, dispatch] = useStateValue();

  const [_checked, setChecked] = useState(true);
  const [settings, setSettings] = useState([]);

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

  const handleSetScreen = (uuid, screen) => {
    const { source, request } = PATCH(`/media/${uuid}/set`, { screen });

    request.then((res) => {
      alert(res.data.message);
      fetchMedias();
    });
  };

  const getSettings = () => {
    const { source, request } = GET("/settings");

    request.then((res) => {
      setSettings(res.data.sub);
      setChecked(res.data.sub[0].value === "true");
    });
  };

  const handleOnChange = (checked) => {
    setChecked(checked);

    const { source, request } = PATCH("/settings", {
      name: "show_media",
      value: `${checked}`,
    });

    request.then((res) => {
      console.log(res.data.message);
    });
  };

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <>
      <Row>
        <Col lg={7} className="d-flex align-items-center mb-3">
          <BootstrapSwitchButton
            checked={_checked}
            onChange={handleOnChange}
            width={100}
          />
          <span className="ms-2 fs-5">Show media main screen</span>
        </Col>
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

        <Row>
          <Form className="d-flex">
            <Col lg={10} className="d-flex ms-auto mb-3 me-2">
              <InputGroup className="">
                <FormControl
                  type="text"
                  placeholder="Input annoucement on marquee"
                />
              </InputGroup>

              <Button className="btn btn-primary text-group text-nowrap">
                Push
              </Button>
            </Col>
            <Col lg={2} className="d-flex ms-auto mb-3">
              <InputGroup className="me-2">
                <FormControl type="number" placeholder="00" />
              </InputGroup>

              <Button className="btn btn-primary text-group text-nowrap">
                Set
              </Button>
            </Col>
          </Form>
        </Row>
      </Row>
      <Table striped>
        <thead>
          <tr>
            <th>Media ID</th>
            <th>Name</th>
            <th>Screen</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {medias && medias.length > 0 ? (
            medias.map((media) => (
              <tr>
                <td>{media.uuid}</td>
                <td>{media.name}</td>
                <td>{media.slot || "--"}</td>
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

                  <div class="dropdown">
                    <Button variant="secondary" className="me-2 dropbtn">
                      <FaEllipsisV />
                    </Button>
                    <div class="dropdown-content">
                      <Button
                        variant="light"
                        onClick={() => handleSetScreen(`${media.uuid}`, 1)}
                      >
                        Show to screen 1
                      </Button>
                      <Button
                        variant="light"
                        onClick={() => handleSetScreen(`${media.uuid}`, 2)}
                      >
                        Show to screen 2
                      </Button>
                      <Button
                        variant="light"
                        onClick={() => handleSetScreen(`${media.uuid}`, null)}
                      >
                        Set to None
                      </Button>
                    </div>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center">
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
