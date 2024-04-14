import React, { useEffect } from "react";

import ToiGetMap from "../components/ToiGetMap";
import ToiletTable from "../components/ToiletTable";
import ToiGetForm from "../components/ToiGetForm";
import { useToiGet } from "../components/ToiGetProvider";
import { Navigate } from "react-router-dom";
import { Row, Col, Alert } from "react-bootstrap";

export default function UpdatePage() {
  const {
    insertMode,
    updateMode,
    setUpdateMode,
    updateAuthorizationError,
    setUpdateAuthorizationError,
  } = useToiGet();

  useEffect(() => {
    if (insertMode) {
      setUpdateMode(() => false);
    }
  }, [insertMode, setUpdateMode]);

  if (!updateMode) {
    return <Navigate to="/" replace />;
  }
  if (insertMode) {
    setUpdateMode(() => false);
    return <Navigate to="/insert" replace />;
  }

  return (
    <div style={{ backgroundColor: "lightblue" }} data-bs-theme="dark">
      <div>
        <div style={{ padding: "10px" }}>
          <ToiGetMap />
        </div>
      </div>
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

      <div>{updateMode && <ToiGetForm />}</div>
      <div>
        <ToiletTable />
      </div>
      <footer></footer>
    </div>
  );
}
