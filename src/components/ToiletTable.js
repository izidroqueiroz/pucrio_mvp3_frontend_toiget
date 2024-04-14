import { useState, useEffect } from "react";
import { useToiGet } from "../components/ToiGetProvider";
import { Table, Row, Col, Alert } from "react-bootstrap";
import { getUserName, atualizaDistancias } from "../util/utils";

// Tabela de banheiros, apresentada na parte inferior da página principal

function ToiletTable() {
  const {
    distanceList,
    userList,
    toiletList,
    setToiletList,
    currentPosition,
    setDistanceList,
    user,
  } = useToiGet();

  const [deleteError, setDeleteError] = useState(false);
  const [deleteAuthorizationError, setDeleteAuthorizationError] =
    useState(false);
  const [tableOrder, setTableOrder] = useState([]);

  useEffect(() => {
    if (distanceList) {
      let ordem = [];
      for (let i = 0; i < distanceList.length; i++) {
        ordem.push(i);
      }
      let houveAlteracao = true;
      let limite = distanceList.length;
      while (houveAlteracao) {
        houveAlteracao = false;
        for (let i = 0; i < limite - 1; i++) {
          if (distanceList[ordem[i]] > distanceList[ordem[i + 1]]) {
            let aux = ordem[i + 1];
            ordem[i + 1] = ordem[i];
            ordem[i] = aux;
            houveAlteracao = true;
          }
        }
        limite--;
      }
      setTableOrder(() => ordem);
    }
  }, [distanceList]);

  function deleteToilet(latitude, longitude) {
    const deleteToilet = async (latitude, longitude) => {
      let url = 'http://127.0.0.1:5000/toilet?lat=' + latitude + '&long=' + longitude;
      fetch(url, {
        method: 'delete'
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error('Error:', error);
          return;
        });
    }

    if (user) {
      const t = toiletList.filter(
        (toilet) =>
          toilet.latitude === latitude && toilet.longitude === longitude
      );
      if (user.email === t[0].user || user.role === "admin") {
        deleteToilet(latitude, longitude);
        setToiletList((prev) => {
          const newToiletList = prev.filter(
            (toilet) =>
              toilet.latitude !== latitude && toilet.longitude !== longitude
          );
          localStorage.setItem("toiletList", JSON.stringify(newToiletList));
          setDistanceList(() => {
            let newDistanceList = atualizaDistancias(
              newToiletList,
              currentPosition
            );
            let ordem = [];
            for (let i = 0; i < newDistanceList.length; i++) {
              ordem.push(i);
            }
            setTableOrder(() => ordem);
            return newDistanceList;
          });
          return newToiletList;
        });
      } else {
        setDeleteAuthorizationError(() => true);
      }
    } else {
      setDeleteError(() => true);
    }
  }

  return (
    <div className="p-5" data-bs-theme="dark">
      <div>
        {deleteError && (
          <Row className="p-2 justify-content-md-center">
            <Col md="auto">
              <Alert
                variant="danger"
                onClose={() => setDeleteError(false)}
                dismissible
              >
                <Alert.Heading>Erro na exclusão de um banheiro</Alert.Heading>
                <p>Apenas usuários identificados podem excluir um banheiro.</p>
                <p>Faça login para excluir.</p>
              </Alert>
            </Col>
          </Row>
        )}
        {deleteAuthorizationError && (
          <Row className="p-2 justify-content-md-center">
            <Col md="auto">
              <Alert
                variant="danger"
                onClose={() => setDeleteAuthorizationError(false)}
                dismissible
              >
                <Alert.Heading>
                  Erro na exclusão de um banheiro - falta de autorização
                </Alert.Heading>
                <p>
                  Apenas administradores podem excluir um banheiro incluído por
                  outra pessoa.
                </p>
                <p>Exclua apenas um banheiro incluído por você.</p>
              </Alert>
            </Col>
          </Row>
        )}
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Classificação</th>
            <th>Descrição</th>
            <th>Tipo Banheiro</th>
            <th>Distância</th>
            <th>Autor</th>
            <th>
              <img
                src="https://cdn-icons-png.flaticon.com/512/126/126468.png"
                width="15px"
                height="15px"
                alt=""
              />
            </th>
          </tr>
        </thead>
        <tbody hover="true">
          {toiletList
            ? tableOrder.map((ix, index) => (
                <tr key={index}>
                  <td>
                    {toiletList[ix] ? toiletList[ix].latitude.toFixed(4) : null}
                  </td>
                  <td>
                    {toiletList[ix]
                      ? toiletList[ix].longitude.toFixed(4)
                      : null}
                  </td>
                  <td>
                    {toiletList[ix] ? toiletList[ix].classification : null}
                  </td>
                  <td>{toiletList[ix] ? toiletList[ix].description : null}</td>
                  <td>{toiletList[ix] ? toiletList[ix].toiletType : null} </td>
                  <td>
                    <div className="text-end">
                      {distanceList[ix]
                        ? distanceList[ix].toFixed(2)
                        : distanceList[ix]}{" "}
                    </div>
                  </td>
                  <td>{getUserName(userList, toiletList[ix].user)}</td>
                  <td>
                    <div className="text-center">
                      <button
                        onClick={() =>
                          deleteToilet(
                            toiletList[ix].latitude,
                            toiletList[ix].longitude
                          )
                        }
                      >
                        x
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </Table>
    </div>
  );
}

export default ToiletTable;
