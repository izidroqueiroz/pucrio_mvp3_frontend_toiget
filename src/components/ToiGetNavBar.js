import React, { useState, useEffect } from "react";

import { Container, Nav, Navbar, Button } from "react-bootstrap";
import ToiGetBrand from "./ToiGetBrand";
import { useToiGet } from "../components/ToiGetProvider";
import { getUserName } from "../util/utils";

function ToiGetNavbar() {
  const [usuario, setUsuario] = useState();
  const { token, onLogout, userList } = useToiGet();

  useEffect(() => {
    if (token) {
      const emailLocal = JSON.parse(localStorage.getItem("email"));
      setUsuario(getUserName(userList, emailLocal));
    }
  }, [token, userList]);

  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container>
        <ToiGetBrand />
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            {!token && <Nav.Link href="/login">Login</Nav.Link>}
            <Nav.Link href="/help">Ajuda</Nav.Link>
          </Nav>
          <Nav className="me-auto">
            {token && <Navbar.Text> Usuário: {usuario} </Navbar.Text>}
            {token && (
              <div className="d-flex justify-content-end mb-3">
                <Container>
                  <Button variant="primary" onClick={onLogout}>
                    Logout
                  </Button>{" "}
                </Container>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ToiGetNavbar;
