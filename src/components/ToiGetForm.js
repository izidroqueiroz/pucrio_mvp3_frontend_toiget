import React, { useState, useEffect } from "react";
import { useToiGet } from "../components/ToiGetProvider";
import { Card, Form, Alert, Row, Col, Button } from "react-bootstrap";

import HorarioSemana from "../components/HorarioSemana";
import { atualizaDistancias } from "../util/utils";

// Form para inclusão e alteração de banheiros
export default function ToiGetForm() {
  const {
    toiletList,
    setToiletList,
    toiletPosition,
    insertMode,
    setInsertMode,
    updateMode,
    setUpdateMode,
    user,
    currentPosition,
    setDistanceList,
  } = useToiGet();

  const [classifError, setClassifError] = useState(false);
  const [toiletTypeError, setToiletTypeError] = useState(false);
  const [horarioSemanaError, setHorarioSemanaError] = useState(false);

  const [inputToilet, setInputToilet] = useState(null);
  const [inputHorario, setInputHorario] = useState(null);
  const [botao, setBotao] = useState("Incluir banheiro");

  const diasSemana = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo",
  ];

  useEffect(() => {
    function initHorario() {
      let inputHorario = []; // usado em HorarioSemana, via props
      for (let i = 0; i < 7; i++) {
        let isCheckedAberto = true;
        let isCheckedFechado = false;
        let horaInicioDisabled = false;
        let horaFimDisabled = false;
        let horaInicio = "10:00";
        let horaFim = "22:00";
        inputHorario.push({
          isCheckedAberto: isCheckedAberto,
          isCheckedFechado: isCheckedFechado,
          horaInicioDisabled: horaInicioDisabled,
          horaFimDisabled: horaFimDisabled,
          horaInicio: horaInicio,
          horaFim: horaFim,
        });
      }
      return inputHorario;
    }

    function getHorario(toiletOpeningHours) {
      if (toiletOpeningHours) {
        let inputHorario = []; // usado em HorarioSemana, via props
        for (let i = 0; i < toiletOpeningHours.length; i++) {
          let isCheckedAberto;
          let isCheckedFechado;
          let horaInicioDisabled;
          let horaFimDisabled;
          if (toiletOpeningHours[i].openClosed === "O") {
            isCheckedAberto = true;
            isCheckedFechado = false;
            horaInicioDisabled = false;
            horaFimDisabled = false;
          } else {
            isCheckedAberto = false;
            isCheckedFechado = true;
            horaInicioDisabled = true;
            horaFimDisabled = true;
          }
          let horaInicio = toiletOpeningHours[i].openingTime
            ? toiletOpeningHours[i].openingTime.substring(0, 5)
            : null;
          let horaFim = toiletOpeningHours[i].closingTime
            ? toiletOpeningHours[i].closingTime.substring(0, 5)
            : null;
          inputHorario.push({
            isCheckedAberto: isCheckedAberto,
            isCheckedFechado: isCheckedFechado,
            horaInicioDisabled: horaInicioDisabled,
            horaFimDisabled: horaFimDisabled,
            horaInicio: horaInicio,
            horaFim: horaFim,
          });
        }
        return inputHorario;
      } else {
        return null;
      }
    }

    const toiletListLocal = toiletList;
    if (updateMode) {
      setBotao("Alterar banheiro");
      for (let i = 0; i < toiletListLocal.length; i++) {
        if (
          toiletListLocal[i].latitude === toiletPosition.lat &&
          toiletListLocal[i].longitude === toiletPosition.lng
        ) {
          setInputToilet({
            latitude: toiletPosition.lat,
            longitude: toiletPosition.lng,
            classification: toiletListLocal[i]
              ? toiletListLocal[i].classification
              : null,
            description: toiletListLocal[i]
              ? toiletListLocal[i].description
              : null,
            toiletType: toiletListLocal[i]
              ? toiletListLocal[i].toiletType
              : null,
          });
          setInputHorario(() => getHorario(toiletListLocal[i].openingHours)); // usado em HorarioSemana, via props
        }
      }
    } else {
      /* Inclusão */
      setInputToilet({
        latitude: toiletPosition.lat,
        longitude: toiletPosition.lng,
        classification: null,
        description: null,
        toiletType: null,
      });
      setInputHorario(() => initHorario()); // usado em HorarioSemana, via props
    }
  }, [toiletList, setToiletList, toiletPosition, updateMode]);

  // Tratamento de eventos dos campos Classificação, Descrição e Tipo de Banheiro
  const handleClassif = (e) => {
    let inputClassification = e.target.id.substr(4, 4);
    setInputToilet({ ...inputToilet, classification: inputClassification });
  };

  const handleDescription = (e) => {
    setInputToilet({ ...inputToilet, description: e.target.value });
  };

  const handleToiletType = (e) => {
    let inputToiletType;
    switch (e.target.id) {
      case "publico":
        inputToiletType = "Público";
        break;
      case "pago":
        inputToiletType = "Pago";
        break;
      default:
        inputToiletType = null;
    }
    setInputToilet({ ...inputToilet, toiletType: inputToiletType });
  };

  // Crítica dos campos CLassificação e Tipo de Banheiro
  function checkClassification() {
    if (inputToilet.classification) {
      setClassifError(false);
      return true;
    } else {
      setClassifError(true);
      return false;
    }
  }

  function checkToiletType() {
    if (inputToilet.toiletType) {
      setToiletTypeError(false);
      return true;
    } else {
      setToiletTypeError(true);
      return false;
    }
  }

  function insertOpeningHours() {
    // Retorno do componente HorarioSemana
    const newOpeningHoursList = [];
    let openClosed;
    for (let i = 0; i < diasSemana.length; i++) {
      let diaSemana = i;
      let checkName = "abertoFechado" + diasSemana[diaSemana].substring(0, 3);
      let horaInicioName = "horaInicio" + diasSemana[diaSemana].substring(0, 3);
      let horaFimName = "horaFim" + diasSemana[diaSemana].substring(0, 3);
      const abertoFechado = JSON.parse(localStorage.getItem(checkName));
      const horaInicio = JSON.parse(localStorage.getItem(horaInicioName));
      const horaFim = JSON.parse(localStorage.getItem(horaFimName));
      if (abertoFechado === "Aberto") {
        openClosed = "O";
      } else {
        openClosed = "C";
      }
      let openingTime = horaInicio;
      let closingTime = horaFim;
      let newOpeningHours = {
        weekday: diaSemana,
        openClosed: openClosed,
        openingTime: openingTime,
        closingTime: closingTime,
      };
      newOpeningHoursList.push(newOpeningHours);
      localStorage.removeItem(checkName);
      localStorage.removeItem(horaInicioName);
      localStorage.removeItem(horaFimName);
    }
    return newOpeningHoursList;
  }

  function updateOpeningHours(openingHours) {
    // Retorno do componente HorarioSemana
    if (openingHours) {
      const newOpeningHours = openingHours;
      for (let i = 0; i < newOpeningHours.length; i++) {
        let diaSemana = newOpeningHours[i].weekday;
        let checkName = "abertoFechado" + diasSemana[diaSemana].substring(0, 3);
        let horaInicioName =
          "horaInicio" + diasSemana[diaSemana].substring(0, 3);
        let horaFimName = "horaFim" + diasSemana[diaSemana].substring(0, 3);
        const abertoFechado = JSON.parse(localStorage.getItem(checkName));
        const horaInicio = JSON.parse(localStorage.getItem(horaInicioName));
        const horaFim = JSON.parse(localStorage.getItem(horaFimName));
        if (abertoFechado === "Aberto") {
          newOpeningHours[i].openClosed = "O";
        } else {
          newOpeningHours[i].openClosed = "C";
        }
        newOpeningHours[i].openingTime = horaInicio;
        newOpeningHours[i].closingTime = horaFim;
        localStorage.removeItem(checkName);
        localStorage.removeItem(horaInicioName);
        localStorage.removeItem(horaFimName);
      }
      return newOpeningHours;
    }
  }

  async function handleSubmit(e) {
    // Tratamento do form

    const postToilet = async (
      inputLatitude,
      inputLongitude,
      inputClassificacao,
      inputDescricao,
      inputTipoToilet,
      inputUser,
      horarios
    ) => {
      const formData = new FormData();
      formData.append("latitude", inputLatitude);
      formData.append("longitude", inputLongitude);
      formData.append("classification", inputClassificacao);
      formData.append("description", inputDescricao);
      formData.append("toiletType", inputTipoToilet);
      formData.append("user", inputUser);
      horarios.forEach((item) => {
        formData.append(`openingHours`, JSON.stringify(item));
      });

      var urlPost = "http://127.0.0.1:5000/toilet";
      if (updateMode) {
        urlPost = "http://127.0.0.1:5000/toiletEdit";
      }
      let url = urlPost;
      fetch(url, {
        method: "post",
        body: formData,
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error("Error:", error);
          return false; /* houve erro */
        });
      return true; /* indica que não houve erro */
    };

    let validated =
      checkClassification() && checkToiletType() && !horarioSemanaError;

    if (validated === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();
      if (insertMode) {
        const newOpeningHours = insertOpeningHours();
        let newToilet = {
          latitude: toiletPosition.lat,
          longitude: toiletPosition.lng,
          classification: inputToilet.classification,
          description: inputToilet.description,
          toiletType: inputToilet.toiletType,
          user: user.email,
          openingHours: newOpeningHours,
        };
        let postOK = postToilet(
          newToilet.latitude,
          newToilet.longitude,
          newToilet.classification,
          newToilet.description,
          newToilet.toiletType,
          newToilet.user,
          newToilet.openingHours
        );
        if (postOK) {
          setToiletList((prev) => {
            let newToiletList = prev;
            newToiletList.push(newToilet);
            localStorage.setItem("toiletList", JSON.stringify(newToiletList));
            return newToiletList;
          });
          setDistanceList(() =>
            atualizaDistancias(toiletList, currentPosition)
          );
        }
        setInsertMode(false);
      }
      if (updateMode) {
        setToiletList((prev) => {
          let newToiletList = prev;
          for (let i = 0; i < newToiletList.length; i++) {
            if (
              newToiletList[i].latitude === toiletPosition.lat &&
              newToiletList[i].longitude === toiletPosition.lng
            ) {
              let prevOpeningHours = newToiletList[i].openingHours;
              newToiletList[i].classification = inputToilet.classification;
              newToiletList[i].description = inputToilet.description;
              newToiletList[i].toiletType = inputToilet.toiletType;
              newToiletList[i].openingHours =
                updateOpeningHours(prevOpeningHours);
              postToilet(
                newToiletList[i].latitude,
                newToiletList[i].longitude,
                newToiletList[i].classification,
                newToiletList[i].description,
                newToiletList[i].toiletType,
                newToiletList[i].user,
                newToiletList[i].openingHours
              );
            }
          }
          localStorage.setItem("toiletList", JSON.stringify(newToiletList));
          return newToiletList;
        });
        setUpdateMode(false);
      }
    }
  }

  return (
    <div className="p-2 fs-6">
      <Form>
        <Row className="p-2">
          <Col>
            <Card className="shadow" data-bs-theme="dark">
              <Card.Header>Localização</Card.Header>
              <Card.Body>
                <Form.Group className="mb-1" controlId="latitude">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    type="text"
                    value={toiletPosition.lat}
                    readOnly
                  />
                </Form.Group>
                <Form.Group className="mb-1" controlId="longitude">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    type="text"
                    value={toiletPosition.lng}
                    readOnly
                  />
                </Form.Group>
              </Card.Body>
            </Card>{" "}
          </Col>
          <Col>
            <Card className="shadow" data-bs-theme="dark">
              <Card.Header>Classificação</Card.Header>
              <Card.Body>
                <div className="mb-3" key="classification">
                  <Form.Check
                    checked={
                      inputToilet
                        ? inputToilet.classification
                          ? inputToilet.classification === "1"
                          : ""
                        : ""
                    }
                    value={"1"}
                    type="radio"
                    label="1 estrela"
                    name="classif"
                    onChange={handleClassif}
                    id="star1"
                  />
                  <Form.Check
                    checked={
                      inputToilet
                        ? inputToilet.classification
                          ? inputToilet.classification === "2"
                          : ""
                        : ""
                    }
                    value={"2"}
                    type="radio"
                    label="2 estrelas"
                    name="classif"
                    onChange={handleClassif}
                    id="star2"
                  />
                  <Form.Check
                    checked={
                      inputToilet
                        ? inputToilet.classification
                          ? inputToilet.classification === "3"
                          : ""
                        : ""
                    }
                    value={"3"}
                    type="radio"
                    label="3 estrelas"
                    name="classif"
                    onChange={handleClassif}
                    id="star3"
                  />
                  <Form.Check
                    checked={
                      inputToilet
                        ? inputToilet.classification
                          ? inputToilet.classification === "4"
                          : ""
                        : ""
                    }
                    value={"4"}
                    type="radio"
                    label="4 estrelas"
                    name="classif"
                    onChange={handleClassif}
                    id="star4"
                  />
                  <Form.Check
                    checked={
                      inputToilet
                        ? inputToilet.classification
                          ? inputToilet.classification === "5"
                          : ""
                        : ""
                    }
                    value={"5"}
                    type="radio"
                    label="5 estrelas"
                    name="classif"
                    onChange={handleClassif}
                    id="star5"
                  />
                </div>
                {classifError && (
                  <Alert
                    variant="danger"
                    onClose={() => setClassifError(false)}
                    dismissible
                  >
                    <p>Classificação não informada.</p>
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6}>
            <Card className="shadow" data-bs-theme="dark">
              <Card.Header>Descrição (opcional)</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3" controlId="description">
                  <Form.Control
                    type="text"
                    placeholder="Informe a descrição"
                    value={
                      inputToilet
                        ? inputToilet.description
                          ? inputToilet.description
                          : ""
                        : ""
                    }
                    onChange={handleDescription}
                  />
                </Form.Group>
              </Card.Body>
            </Card>{" "}
          </Col>
          <Col>
            <Card className="shadow" data-bs-theme="dark">
              <Card.Header>Tipo do banheiro</Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <Form.Check
                    checked={
                      inputToilet
                        ? inputToilet.toiletType
                          ? inputToilet.toiletType === "Público"
                          : ""
                        : ""
                    }
                    type="radio"
                    label="Público"
                    name="toiletType"
                    onChange={handleToiletType}
                    id="publico"
                  />
                  <Form.Check
                    checked={
                      inputToilet
                        ? inputToilet.toiletType
                          ? inputToilet.toiletType === "Pago"
                          : ""
                        : ""
                    }
                    type="radio"
                    label="Pago"
                    name="toiletType"
                    onChange={handleToiletType}
                    id="pago"
                  />
                </div>
                {toiletTypeError && (
                  <Alert
                    variant="danger"
                    onClose={() => setToiletTypeError(false)}
                    dismissible
                  >
                    <p>Tipo do banheiro não informado.</p>
                  </Alert>
                )}
              </Card.Body>
            </Card>{" "}
          </Col>
        </Row>
        <Row className="p-2">
          <Card className="shadow" data-bs-theme="dark">
            <Card.Header>Horário por dia da semana</Card.Header>
            <Card.Body>
              <Row>
                {diasSemana.map((dia, index) => (
                  <HorarioSemana
                    key={index}
                    diaSemana={dia}
                    horario={inputHorario ? inputHorario[index] : null}
                    setError={setHorarioSemanaError}
                  />
                ))}
              </Row>
            </Card.Body>
          </Card>{" "}
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto">
            {" "}
            <Button variant="primary" onClick={handleSubmit}>
              {botao}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
