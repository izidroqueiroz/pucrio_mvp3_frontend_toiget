import React from "react";
import "leaflet/dist/leaflet.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import InsertPage from "./pages/InsertPage";
import UpdatePage from "./pages/UpdatePage";
import HelpPage from "./pages/HelpPage";
import ToiGetProvider from "./components/ToiGetProvider";
import ToiGetNavbar from "./components/ToiGetNavBar";

const App = () => {
  return (
    <ToiGetProvider>
      <BrowserRouter>
        <ToiGetNavbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/insert" element={<InsertPage />} />
          <Route path="/update" element={<UpdatePage />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </BrowserRouter>
    </ToiGetProvider>
  );
};

export default App;
