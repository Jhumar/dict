import { useEffect, useRef, useState } from "react";

import { Container, Row, Col, Table } from "react-bootstrap";

import ViewingNavbar from "./../components/ViewingNavbar";

import { useStateValue } from "../contexts/StateProvider";

import { GET } from "./../utils/axios";

function MainView() {
  const QUEUE_PER_PAGE = 7;
  const [page, _setPage] = useState(1);

  const pageRef = useRef(page);
  const setPage = (data) => {
    pageRef.current = data;
    _setPage(data);
  };

  const [{ source }, dispatch] = useStateValue();
  const [queues, setQueues] = useState([]);

  const fetchQueues = () => {
    const { request, source } = GET("/queue");

    dispatch({
      type: "SET_SOURCE",
      source,
    });

    request.then((res) => {
      setQueues(res.data.sub);
    });
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPage(
        (pageRef.current + 1) * QUEUE_PER_PAGE - 1 <= queues.length
          ? pageRef.current + 1
          : 1
      );
    }, 5000);

    const interval1 = window.setInterval(() => {
      fetchQueues();
    }, 1000);

    return () => {
      window.clearInterval(interval);

      window.clearInterval(interval1);
    };
  }, []);

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

  return (
    <>
      <Container fluid className="p-0">
        <ViewingNavbar />
        <Row className="me-0">
          <Col xl={9}>
            <Table striped className="text-center p-0">
              <thead>
                <tr>
                  <th className="fs-4">Department</th>
                  <th className="fs-4">Window number</th>
                  <th className="fs-4">Service number</th>
                </tr>
              </thead>
              <tbody>
                {queues && queues.length > 0 ? (
                  queues
                    .filter(
                      (_, i) =>
                        i >= (page - 1) * QUEUE_PER_PAGE &&
                        i <= page * QUEUE_PER_PAGE - 1
                    )
                    .map((queue) => (
                      <tr key={Math.random()}>
                        <td className="w-50 fs-4">
                          College of Hospitality Management and Tourism
                        </td>
                        <td className="fs-4">{queue.window_name}</td>
                        <td className="fs-4">{queue.number}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center">
                      No queue available.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>

          <Col xl={3} className="p-0">
            <div className="d-flex flex-column">
              <div
                style={{ height: "45vh" }}
                className="d-flex justify-content-center align-items-center bg-secondary"
              >
                News
              </div>
              <div
                style={{ height: "45vh" }}
                className="d-flex justify-content-center align-items-center bg-secondary"
              >
                News
              </div>
            </div>
          </Col>
        </Row>

        {/* eslint-disable-next-line */}
        {/* <marquee className="bg-dark text-danger fixed-bottom fs-4">
          LAGUNA STATE POLYTECHNIC UNIVERSITY
        </marquee> */}
      </Container>
    </>
  );
}

export default MainView;
