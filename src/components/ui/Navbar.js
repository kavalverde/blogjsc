import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Navbar, Nav, Container } from "react-bootstrap";

const NavbarComponent = () => {
  const logoSrc = require("../../assets/img/logo.png");
  return (
    <Navbar sticky="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>
          <Link to="/" style={{ color: "white", textDecoration: "inherit" }}>
            <img src={logoSrc} alt="logo" width="40px" className="mx-3 mb-1" />
            <span className="fs-5 fw-bold">Movimiento JSC</span>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto ">
            <Link
              to="Login"
              className="btn btn-outline-light mt-1"
              style={{
                textDecoration: "inherit",
              }}
            >
              Iniciar Sesión
            </Link>
          </Nav>
          <Nav>
            <div className="d-flex align-items-center justify-content-center mt-2">
              <FaFacebook className="text-light fs-4 ms-4" />
              <FaInstagram className="text-light fs-4 ms-2" />
              <FaTwitter className="text-light fs-4 ms-2" />
              <FaYoutube className="text-light fs-4 mx-2" />
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
