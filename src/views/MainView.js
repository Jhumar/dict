import { useEffect, useRef, useState } from "react";

import { Container, Row, Col, Table } from "react-bootstrap";

import ViewingNavbar from "./../components/ViewingNavbar";

import { useStateValue } from "../contexts/StateProvider";

import { API_URL, GET } from "./../utils/axios";

function MainView() {
  // date and time

  const QUEUE_PER_PAGE = 7;
  const [page, _setPage] = useState(1);

  const pageRef = useRef(page);
  const setPage = (data) => {
    pageRef.current = data;
    _setPage(data);
  };

  const [{ source }, dispatch] = useStateValue();
  const [queues, setQueues] = useState([]);
  const [ads, _setAds] = useState([]);

  const adsRef = useRef(ads);
  const setAds = (data) => {
    adsRef.current = data;
    _setAds(data);
  };

  const [settings, setSettings] = useState([]);

  const INDEX_OF_MEDIA_AT_SLOT_ONE = useRef(0);
  const INDEX_OF_MEDIA_AT_SLOT_TWO = useRef(0);

  const ELAPSED_TIME_AT_SLOT_ONE = useRef(0);
  const ELAPSED_TIME_AT_SLOT_TWO = useRef(0);

  const getAds = () => {
    const { request, source } = GET("/media/p/r");

    request.then((res) => {
      setAds(res.data.sub);
    });
  };

  const getSettings = () => {
    const { request, source } = GET("/settings");

    request.then((res) => {
      const settings = res.data.sub.reduce((prev, curr) => {
        prev[curr.name] = curr.value;

        return prev;
      }, {});

      setSettings(settings);
    });
  };

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

  const checkLoop = () => {
    // if ((adsRef.current.slot_one || []).length > 0) {
    //   const currentMediaAtSlotOne =
    //     adsRef.current.slot_one[INDEX_OF_MEDIA_AT_SLOT_ONE];

    //   console.log(currentMediaAtSlotOne);

    //   if (ELAPSED_TIME_AT_SLOT_ONE + 1 < currentMediaAtSlotOne.duration) {
    //     ELAPSED_TIME_AT_SLOT_ONE.current += 1;
    //   } else {
    //     INDEX_OF_MEDIA_AT_SLOT_ONE.current =
    //       INDEX_OF_MEDIA_AT_SLOT_ONE.current + 1 <
    //       adsRef.current.slot_one.length
    //         ? INDEX_OF_MEDIA_AT_SLOT_ONE.current + 1
    //         : 0;
    //     ELAPSED_TIME_AT_SLOT_ONE.current = 0;
    //   }
    // }

    if (adsRef.current.length <= 0) return;

    const slot_one = adsRef.current.slot_one || [];
    const slot_two = adsRef.current.slot_two || [];

    if (slot_one.length > 0) {
      const currentMediaAtSlotOne =
        slot_one[INDEX_OF_MEDIA_AT_SLOT_ONE.current];

      if (
        ELAPSED_TIME_AT_SLOT_ONE.current + 1 <
        currentMediaAtSlotOne.duration
      ) {
        ELAPSED_TIME_AT_SLOT_ONE.current += 1;
      } else {
        INDEX_OF_MEDIA_AT_SLOT_ONE.current =
          INDEX_OF_MEDIA_AT_SLOT_ONE.current + 1 < slot_one.length
            ? INDEX_OF_MEDIA_AT_SLOT_ONE.current + 1
            : 0;
        ELAPSED_TIME_AT_SLOT_ONE.current = 0;
      }
    }

    if (slot_two.length > 0) {
      const currentMediaAtSlotTwo =
        slot_two[INDEX_OF_MEDIA_AT_SLOT_TWO.current];

      if (
        ELAPSED_TIME_AT_SLOT_TWO.current + 1 <
        currentMediaAtSlotTwo.duration
      ) {
        ELAPSED_TIME_AT_SLOT_TWO.current += 1;
      } else {
        INDEX_OF_MEDIA_AT_SLOT_TWO.current =
          INDEX_OF_MEDIA_AT_SLOT_TWO.current + 1 < slot_two.length
            ? INDEX_OF_MEDIA_AT_SLOT_TWO.current + 1
            : 0;
        ELAPSED_TIME_AT_SLOT_TWO.current = 0;
      }
    }

    // if ((adsRef.current.slot_two || []).length > 0) {
    //   const currentMediaAtSlotTwo =
    //     adsRef.current.slot_one[INDEX_OF_MEDIA_AT_SLOT_TWO];

    //   if (ELAPSED_TIME_AT_SLOT_TWO + 1 < currentMediaAtSlotTwo.duration) {
    //     ELAPSED_TIME_AT_SLOT_TWO.current += 1;
    //   } else {
    //     INDEX_OF_MEDIA_AT_SLOT_TWO.current =
    //       INDEX_OF_MEDIA_AT_SLOT_TWO.current + 1 <
    //       adsRef.current.slot_two.length
    //         ? INDEX_OF_MEDIA_AT_SLOT_TWO.current + 1
    //         : 0;
    //     ELAPSED_TIME_AT_SLOT_TWO.current = 0;
    //   }
    // }
  };

  useEffect(() => {
    getAds();
    getSettings();

    const interval1 = window.setInterval(() => {
      fetchQueues();
    }, 1000);

    // const interval2 = window.setInterval(() => {
    //   getAds();
    // }, 1000);

    const interval3 = window.setInterval(() => {
      getSettings();
    }, 1000);

    const adsInterval = window.setInterval(() => {
      checkLoop();
    }, 1000);

    return () => {
      window.clearInterval(interval1);
      // window.clearInterval(interval2);
      window.clearInterval(interval3);
      window.clearInterval(adsInterval);
    };
  }, []);

  useEffect(() => {
    if (!settings.page_speed) {
      return;
    }

    const interval = window.setInterval(() => {
      setPage(
        (pageRef.current + 1) * QUEUE_PER_PAGE <= queues.length + QUEUE_PER_PAGE
          ? pageRef.current + 1
          : 1
      );
    }, parseInt(settings.page_speed) * 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [settings.page_speed]);

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
          <Col xl={settings.show_media === "true" ? 8 : 12}>
            <Table striped className="text-center p-0">
              <thead>
                <tr>
                  <th className="fs-2">Offices</th>
                  <th className="fs-2">Window</th>
                  <th className="fs-2">Service number</th>
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
                        <td className="w-50 fs-2 py-3 text-start ps-3">
                          {queue.offices}
                        </td>
                        <td className="fs-2 py-3">{queue.window_name}</td>
                        <td className="fs-2 py-3">{queue.number}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center fs-4 py-3">
                      No queue available.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>

          <Col
            xl={4}
            className={{
              "p-0": true,
              "d-none": settings.show_media !== "true",
            }}
          >
            <div className="d-flex flex-column">
              {(ads.slot_one || []).length > 0 ? (
                <>
                  {ads.slot_one[INDEX_OF_MEDIA_AT_SLOT_ONE.current] &&
                    ads.slot_one[INDEX_OF_MEDIA_AT_SLOT_ONE.current].path &&
                    ["png", "jpeg", "jpg"].includes(
                      ads.slot_one[INDEX_OF_MEDIA_AT_SLOT_ONE.current].path
                        .split(".")
                        .pop()
                        .toLowerCase()
                    ) && (
                      <img
                        src={`${API_URL}/media/${
                          ads.slot_one[INDEX_OF_MEDIA_AT_SLOT_ONE.current].uuid
                        }/preview`}
                        className="img-fluid w-100 h-100"
                        alt={
                          ads.slot_one[INDEX_OF_MEDIA_AT_SLOT_ONE.current].name
                        }
                      />
                    )}

                  {ads.slot_one[INDEX_OF_MEDIA_AT_SLOT_ONE.current] &&
                    ads.slot_one[INDEX_OF_MEDIA_AT_SLOT_ONE.current].path &&
                    ["mp4", "mpeg"].includes(
                      ads.slot_one[INDEX_OF_MEDIA_AT_SLOT_ONE.current].path
                        .split(".")
                        .pop()
                        .toLowerCase()
                    ) && (
                      <video
                        width="100%"
                        height="360"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "fill",
                        }}
                        muted
                        autoPlay
                        loop
                      >
                        <source
                          src={`${API_URL}/media/${
                            ads.slot_one[INDEX_OF_MEDIA_AT_SLOT_ONE.current]
                              .uuid
                          }/preview`}
                        ></source>
                      </video>
                    )}
                </>
              ) : (
                <></>
              )}

              {(ads.slot_two || []).length > 0 ? (
                <>
                  {ads.slot_two[INDEX_OF_MEDIA_AT_SLOT_TWO.current] &&
                    ads.slot_two[INDEX_OF_MEDIA_AT_SLOT_TWO.current].path &&
                    ["png", "jpeg", "jpg"].includes(
                      ads.slot_two[INDEX_OF_MEDIA_AT_SLOT_TWO.current].path
                        .split(".")
                        .pop()
                        .toLowerCase()
                    ) && (
                      <img
                        src={`${API_URL}/media/${
                          ads.slot_two[INDEX_OF_MEDIA_AT_SLOT_TWO.current].uuid
                        }/preview`}
                        className="img-fluid w-100 h-100"
                        alt={
                          ads.slot_two[INDEX_OF_MEDIA_AT_SLOT_TWO.current].name
                        }
                      />
                    )}

                  {ads.slot_two[INDEX_OF_MEDIA_AT_SLOT_TWO.current] &&
                    ads.slot_two[INDEX_OF_MEDIA_AT_SLOT_TWO.current].path &&
                    ["mp4", "mpeg"].includes(
                      ads.slot_two[INDEX_OF_MEDIA_AT_SLOT_TWO.current].path
                        .split(".")
                        .pop()
                        .toLowerCase()
                    ) && (
                      <video
                        width="100%"
                        height="360"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "fill",
                        }}
                        muted
                        autoPlay
                        loop
                      >
                        <source
                          src={`${API_URL}/media/${
                            ads.slot_two[INDEX_OF_MEDIA_AT_SLOT_TWO.current]
                              .uuid
                          }/preview`}
                        ></source>
                      </video>
                    )}
                </>
              ) : (
                <></>
              )}
              {/* {(ads.slot_one || []).map((x) => (
                <div
                  style={{ height: "43vh", position: "relative" }}
                  className="border border-2 border-dark"
                >
                  {["png", "jpeg", "jpg"].includes(
                    x.path.split(".").pop().toLowerCase()
                  ) && (
                    <img
                      src={`${API_URL}/media/${x.uuid}/preview`}
                      className="img-fluid w-100 h-100"
                      alt={x.name}
                    />
                  )}

                  {["mp4", "mpeg"].includes(
                    x.path.split(".").pop().toLowerCase()
                  ) && (
                    <video
                      width="100%"
                      height="360"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "fill",
                      }}
                      muted
                      autoPlay
                      loop
                    >
                      <source
                        src={`${API_URL}/media/${x.uuid}/preview`}
                      ></source>
                    </video>
                  )}
                </div>
              ))} */}
              {/* <div
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
              </div> */}
            </div>
          </Col>
        </Row>

        {/* eslint-disable-next-line */}
        <marquee className="bg-dark text-danger fixed-bottom fs-3">
          LAGUNA STATE POLYTECHNIC UNIVERSITY
        </marquee>
      </Container>
    </>
  );
}

export default MainView;
