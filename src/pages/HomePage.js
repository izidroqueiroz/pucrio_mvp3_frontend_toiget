import React from "react";

import ToiGetMap from "../components/ToiGetMap";
import ToiletTable from "../components/ToiletTable";
import { useToiGet } from "../components/ToiGetProvider";
import { Row, Col, Alert } from "react-bootstrap";
import { Navigate } from "react-router-dom";


export default function HomePage() {
  const {
    insertMode,
    insertError,
    setInsertError,
    updateMode,
    updateError,
    setUpdateError,
    updateAuthorizationError,
    setUpdateAuthorizationError,
  } = useToiGet();

  if (insertMode) {
    return <Navigate to="/insert" replace />;
  }

  if (updateMode) {
    return <Navigate to="/update" replace />;
  }

  return (
    <div style={{ backgroundColor: "lightblue" }} data-bs-theme="dark">
      <div>
          <div style={{ padding: "10px" }}>
            <ToiGetMap />
          </div>
      </div>
      <div> 
        {insertError && (
          <Row className="p-2 justify-content-md-center">
            <Col md="auto">
              <Alert
                variant="danger"
                onClose={() => setInsertError(false)}
                dismissible
              >
                <Alert.Heading>Erro na inclusão de um banheiro</Alert.Heading>
                <p>Apenas usuários identificados podem incluir um banheiro.</p>
                <p>Faça login para incluir.</p>
              </Alert>
            </Col>
          </Row>
        )} 
        {updateError && (
          <Row className="p-2 justify-content-md-center">
            <Col md="auto">
              <Alert
                variant="danger"
                onClose={() => setUpdateError(false)}
                dismissible
              >
                <Alert.Heading>Erro na alteração de um banheiro</Alert.Heading>
                <p>Apenas usuários identificados podem alterar um banheiro.</p>
                <p>Faça login para alterar.</p>
              </Alert>
            </Col>
          </Row>
        )} 
        {updateAuthorizationError && (
          <Row className="p-2 justify-content-md-center">
            <Col md="auto">
              <Alert
                variant="danger"
                onClose={() => setUpdateAuthorizationError(false)}
                dismissible
              >
                <Alert.Heading>
                  Erro na alteração de um banheiro - falta de autorização
                </Alert.Heading>
                <p>
                  Apenas administradores podem alterar um banheiro incluído por
                  outra pessoa.
                </p>
                <p>Altere apenas um banheiro incluído por você.</p>
              </Alert>
            </Col>
          </Row>
        )}
      </div> 
      <div>
        <ToiletTable />
      </div>
      <footer></footer>
    </div>
  );
}
