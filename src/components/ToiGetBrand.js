import React from "react";

import Navbar from "react-bootstrap/Navbar";
import ToiGetImg from "../assets/TOIGET.png";

// Logotipo da ToiGet, usado nas três páginas

function ToiGetBrand() {
  return (
    <Navbar.Brand href="/">
      <img
        src={ToiGetImg}
        width="50"
        height="50"
        className="d-inline-block align-top"
        alt="ToiGet logo"
      />
    </Navbar.Brand>
  );
}

export default ToiGetBrand;
