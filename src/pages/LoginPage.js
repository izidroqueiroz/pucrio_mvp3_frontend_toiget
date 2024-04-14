import React, { useState } from "react";
import { useToiGet } from "../components/ToiGetProvider";
import { Button, Modal, Card, Form, Alert } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import ToiGetBrand from "../components/ToiGetBrand";

export default function LoginPage() {
  const { onLogin, userList, setUser } = useToiGet();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [backToHome, setBackToHome] = useState(false);
  const [show, setShow] = useState(true);

  const handleClose = () => { 
    setShow(false);
    setBackToHome(true);
  };

  function handleSubmit(e) {
    e.preventDefault();
    const userFound = userList.find((element) => element.email === email);
    if (userFound) {
      if (userFound.password === password) {
        onLogin();
        localStorage.setItem("user", JSON.stringify(userFound));
        localStorage.setItem("email", JSON.stringify(userFound.email));
        setUser(() => userFound);
        setBackToHome(true);
      } else {
        setPasswordError(true);
      }
    } else {
      setEmailError(true);
    }
  }

  if (backToHome) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <Modal show={show} onHide={handleClose} data-bs-theme="dark">
        <Modal.Header closeButton>
        <ToiGetBrand />
          <Modal.Title style={{margin: "0 auto"}}>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="shadow">
            <Card.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Informe o email"
                    value={email ? email : ''}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Senha"
                    value={password ? password : ''}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>{" "}
          {emailError && (
            <Alert
              variant="danger"
              onClose={() => setEmailError(false)}
              dismissible
            >
              <Alert.Heading>Login inválido</Alert.Heading>
              <p>Usuário não encontrado.</p>
            </Alert>
          )}
          {passwordError && (
            <Alert
              variant="danger"
              onClose={() => setPasswordError(false)}
              dismissible
            >
              <Alert.Heading>Senha inválida</Alert.Heading>
              <p>Senha incorreta.</p>
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
