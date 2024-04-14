import React, { useState, useEffect } from "react";
import { Card, Form, Alert, Col } from "react-bootstrap";

// Componente Horário por dia da semana, usado em ToiGetForm

export default function HorarioSemana({ horario, diaSemana, setError }) {
  const [isCheckedAberto, setIsCheckedAberto] = useState(true);
  const [isCheckedFechado, setIsCheckedFechado] = useState(false);
  const [horaInicio, setHoraInicio] = useState("06:00");
  const [horaFim, setHoraFim] = useState("18:00");
  const [horaInicioDisabled, setHoraInicioDisabled] = useState(false);
  const [horaFimDisabled, setHoraFimDisabled] = useState(false);
  const [horaInicioError, setHoraInicioError] = useState(false);
  const [horaFimError, setHoraFimError] = useState(false);
  const [horaInicioFimError, setHoraInicioFimError] = useState(false);

  let checkName = "abertoFechado" + diaSemana.substring(0, 3);
  let horaInicioName = "horaInicio" + diaSemana.substring(0, 3);
  let horaFimName = "horaFim" + diaSemana.substring(0, 3);

  useEffect(() => {
    if (horario) {
      setIsCheckedAberto(() => horario.isCheckedAberto);
      setIsCheckedFechado(() => horario.isCheckedFechado);
      if (horario.isCheckedAberto) {
        localStorage.setItem(checkName, JSON.stringify("Aberto"));
        if (horario.horaInicio === null) {
          setHoraInicioError(() => true);
          setError(() => true);
        }
        if (horario.horaFim === null) {
          setHoraFimError(() => true);
          setError(() => true);
        }
        if (horario.horaInicio > horario.horaFim) {
          setHoraInicioFimError(() => true);
          setError(() => true);
        }
      }
      if (horario.isCheckedFechado) {
        localStorage.setItem(checkName, JSON.stringify("Fechado"));
      }
      setHoraInicio(() => horario.horaInicio);
      setHoraFim(() => horario.horaFim);
      localStorage.setItem(horaInicioName, JSON.stringify(horario.horaInicio));
      localStorage.setItem(horaFimName, JSON.stringify(horario.horaFim));
      setHoraInicioDisabled(() => horario.horaInicioDisabled);
      setHoraFimDisabled(() => horario.horaFimDisabled);
    }
  }, [horario, setError, checkName, horaInicioName, horaFimName]);

  const handleAbertoFechado = (e) => {
    let fieldId = e.target.id;
    if (fieldId.search("Aberto") > 0) {
      setIsCheckedAberto(() => true);
      setIsCheckedFechado(() => false);
      setHoraInicioDisabled(() => false);
      setHoraFimDisabled(() => false);
      if (horaInicio === null) {
        setHoraInicioError(() => true);
        setError(() => true);
      }
      if (horaFim === null) {
        setHoraFimError(() => true);
        setError(() => true);
      }
      if (horario.horaInicio > horario.horaFim) {
        setHoraInicioFimError(() => true);
        setError(() => true);
      }
      localStorage.setItem(checkName, JSON.stringify("Aberto"));
    } else {
      setError(() => false);
      setIsCheckedAberto(() => false);
      setIsCheckedFechado(() => true);
      setHoraInicio(() => null);
      setHoraFim(() => null);
      localStorage.setItem(horaInicioName, JSON.stringify(null));
      localStorage.setItem(horaFimName, JSON.stringify(null));
      setHoraInicioDisabled(() => true);
      setHoraFimDisabled(() => true);
      localStorage.setItem(checkName, JSON.stringify("Fechado"));
    }
  };

  const handleHoraInicio = (e) => {
    setError(() => false);
    setHoraInicio(() => e.target.value);
    localStorage.setItem(horaInicioName, JSON.stringify(e.target.value));
  };

  const handleHoraFim = (e) => {
    setError(() => false);
    setHoraFim(() => e.target.value);
    localStorage.setItem(horaFimName, JSON.stringify(e.target.value));
  };

  return (
    <Col>
      <Card className="shadow" data-bs-theme="dark">
        <Card.Header>{diaSemana}</Card.Header>
        <Card.Body>
          <div className="mb-3">
            <Form.Check
              type="radio"
              label="Aberto"
              name={checkName}
              checked={isCheckedAberto}
              onChange={handleAbertoFechado}
              id={checkName + "Aberto"}
            />
            <Form.Check
              type="radio"
              label="Fechado"
              name={checkName}
              checked={isCheckedFechado}
              onChange={handleAbertoFechado}
              id={checkName + "Fechado"}
            />
          </div>
          <Form.Group className="mb-3">
            <Form.Label>
              Hora de início
              <Form.Control
                type="time"
                value={horaInicio ? horaInicio : ""}
                onChange={handleHoraInicio}
                id={horaInicioName}
                disabled={horaInicioDisabled}
                name={horaInicioName}
              />
            </Form.Label>
            {horaInicioError && (
              <Alert
                variant="danger"
                onClose={() => setHoraInicioError(false)}
                dismissible
              >
                <p>Hora de início não informada.</p>
              </Alert>
            )}
            {horaInicioFimError && (
              <Alert
                variant="danger"
                onClose={() => setHoraInicioFimError(false)}
                dismissible
              >
                <p>Hora de início maior que a hora de fim.</p>
              </Alert>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Hora de fim
              <Form.Control
                type="time"
                value={horaFim ? horaFim : ""}
                onChange={handleHoraFim}
                id={horaFimName}
                disabled={horaFimDisabled}
                name={horaFimName}
              />
            </Form.Label>
            {horaFimError && (
              <Alert
                variant="danger"
                onClose={() => setHoraFimError(false)}
                dismissible
              >
                <p>Hora de fim não informada.</p>
              </Alert>
            )}
          </Form.Group>
        </Card.Body>
      </Card>
    </Col>
  );
}
