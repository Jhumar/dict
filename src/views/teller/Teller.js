import React, { useEffect, useRef, useState } from "react";

import { Button, Container, Row, Col, Card, ListGroup } from "react-bootstrap";

import UserNavbar from "../../components/UserNavbar";
import "./teller.css";

import { useStateValue } from "./../../contexts/StateProvider";
import { GET, PATCH } from "../../utils/axios";

function Teller() {
  const [{ user }] = useStateValue();
  const cardQueueDOM = useRef(null);
  const [queueListHeight, setQueueListHeight] = useState(0);
  const [queues, setQueues] = useState([]);
  const [currentQueue, setCurrentQueue] = useState(null);
  const [tickInterval, setTickInterval] = useState(null);
  const [ticks, setTicks] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const fetchQueues = (uuid) => {
    const { request, source } = GET("/queue/" + uuid);

    request.then((res) => {
      setQueues(res.data.sub);
    });
  };

  const formatTicks = (tick) => {
    const hours = Math.floor(tick / 3600);
    const minutes = Math.floor((tick % 3600) / 60);
    const seconds = Math.floor(tick % 60);

    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const next = () => {
    const [current, ...rest] = queues;

    if (isRunning) {
      return alert(
        "The queue is still running, please end the current queue to proceed."
      );
    }

    if (!current) {
      return alert("There is no queue available.");
    }

    if (currentQueue) {
      return alert(
        "There is still queue pending, complete it first before requesting."
      );
    }

    setQueues([...rest]);

    setCurrentQueue(current);
  };

  const start = () => {
    if (!currentQueue) {
      return alert("There is no current queue to be served.");
    }

    if (isRunning) {
      return alert("Queue is already running.");
    }

    setIsRunning(true);

    setTickInterval(
      setInterval(() => {
        setTicks((prev) => prev + 1);
      }, 1000)
    );
  };

  const end = () => {
    if (!isRunning) {
      return alert("There are no pending queue running.");
    }

    if (!window.confirm("Are you sure you want to end this queue?")) {
      return;
    }

    setIsRunning(false);

    // Update queues to
    const { request, source } = PATCH("/queue/" + currentQueue.uuid, {
      time_elapsed: ticks,
    });

    request.then((res) => {
      alert(res.data.message);

      setCurrentQueue(null);

      fetchQueues(user.window.uuid);

      setTicks(0);

      clearInterval(tickInterval);

      setTickInterval(null);
    });
  };

  useEffect(() => {
    if (!cardQueueDOM.current) {
      return;
    }

    setQueueListHeight(`${cardQueueDOM.current.clientHeight}px`);
  }, [cardQueueDOM]);

  useEffect(() => {
    let interval = null;

    if (user && user.window && user.window.uuid) {
      fetchQueues(user.window.uuid);

      interval = window.setInterval(() => {
        fetchQueues(user.window.uuid);
      }, 1000);
    }

    return () => {
      if (interval !== null) {
        window.clearInterval(interval);
      }
    };
  }, [user]);

  return (
    <>
      <UserNavbar />

      <Container className="py-5">
        <Row>
          <Col lg={8}>
            <Row>
              <Col className="mb-4" lg={8}>
                <Card ref={cardQueueDOM} className="p-4">
                  <Card.Body className="text-center">
                    <h2 className="fs-5 fw-bold text-warning">
                      CURRENT SERVING
                    </h2>
                    <h3 className="fs-2 fw-bold">QUEUE NUMBER</h3>
                    <Card.Text>
                      <span className="h1 text-warning border border-3 border-warning rounded my-5 p-5 d-inline-block">
                        {currentQueue && currentQueue.number
                          ? currentQueue.number
                          : "--"}
                      </span>
                      <span className="d-block fs-3">SERVING TIME</span>
                      <span className="fs-2">{formatTicks(ticks)}</span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col className="mb-4" lg={4}>
                <div className="d-flex flex-wrap w-100 h-100">
                  <Button
                    className="d-block w-100 mb-3 py-3"
                    variant="primary"
                    onClick={next}
                  >
                    Next
                  </Button>
                  <Button className="d-block w-100 mb-3 py-3" variant="primary">
                    Recall
                  </Button>
                  <Button
                    className="d-block w-100 mb-3 py-3"
                    variant="primary"
                    onClick={start}
                  >
                    Start
                  </Button>
                  <Button
                    className="d-block w-100 py-3"
                    variant="primary"
                    onClick={end}
                  >
                    End
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
          <Col lg={4}>
            <div>
              <ListGroup
                className="scrollable-list-group"
                style={{ maxHeight: queueListHeight }}
              >
                <ListGroup.Item
                  className="fs-5 fw-bold text-center py-4 sticky-top"
                  variant="dark"
                >
                  {user && user.window && user.window.name}
                </ListGroup.Item>
                {(queues || []).length > 0 ? (
                  (queues || []).map((q) => {
                    return (
                      <ListGroup.Item key={q.uuid}>
                        Queue #{q.number}
                      </ListGroup.Item>
                    );
                  })
                ) : (
                  <ListGroup.Item>No queue available</ListGroup.Item>
                )}
              </ListGroup>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Teller;
