import React from "react";
import { Col, Container, Nav } from "react-bootstrap";

import { Outlet, NavLink } from "react-router-dom";

import UserNavbar from "../../components/UserNavbar";

import "./admin.css";

function Admin() {
  return (
    <>
      <Container style={{ height: "100vh" }}>
        <div className="d-flex flex-column h-100">
          <div className="no-print">
            <UserNavbar />
          </div>
          <div className="d-flex flex-fill">
            <Col lg={2} className="bg-dark h-100 no-print">
              <aside className="sticky-top py-4" style={{ top: "76px" }}>
                <Nav className="col-md-12 d-none d-md-block sidebar p-3">
                  <Nav.Item>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? "btn text-start text-light d-block btn-primary mb-2"
                          : "btn text-start text-light d-block mb-2"
                      }
                      to="/admin/media"
                    >
                      Media
                    </NavLink>
                  </Nav.Item>
                  <Nav.Item>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? "btn text-start text-light d-block btn-primary mb-2"
                          : "btn text-start text-light d-block mb-2"
                      }
                      to="/admin/user"
                    >
                      Users
                    </NavLink>
                  </Nav.Item>
                  <Nav.Item>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? "btn text-start text-light d-block btn-primary mb-2"
                          : "btn text-start text-light d-block mb-2"
                      }
                      to="/admin/windows"
                    >
                      Windows
                    </NavLink>
                  </Nav.Item>
                  <Nav.Item>
                    <NavLink
                      className="btn text-start text-light d-block mb-2"
                      to="/logout"
                    >
                      Logout
                    </NavLink>
                  </Nav.Item>
                </Nav>
              </aside>
            </Col>
            <Col lg={10} className="p-4 print">
              <main>
                <Outlet />
              </main>
            </Col>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Admin;
