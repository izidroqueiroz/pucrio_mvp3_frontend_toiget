import React, { useState } from "react";
import { Button, Modal, Card } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import ToiGetBrand from "../components/ToiGetBrand";

// Pagina de ajuda

export default function HelpPage() {
  const [show, setShow] = useState(true);
  const [backToHome, setBackToHome] = useState(false);

  const handleClose = () => {
    setShow(false);
    setBackToHome(true);
  };

  if (backToHome) {
    return <Navigate to="/" replace />;
  }

  return (
    <div data-bs-theme="dark">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <ToiGetBrand />
          <Modal.Title style={{margin: "0 auto"}}>Ajuda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="shadow">
            <Card.Body>
              <h3>Instruções:</h3>
              <p>
                A tabela na parte inferior lista os banheiros cadastrados, em ordem crescente de
                distância em relação ao marcador azul. Arraste o marcador
                para mudar o ponto de referência. O banheiro mais próximo é
                indicado pela cor vermelha.
              </p>
              <p>
                Para incluir, alterar ou excluir um banheiro, é necessário fazer login.
              </p>
              <p>
                Para incluir um banheiro, clique na localização correspondente no mapa. As
                coordenadas geográficas (latitude e longitude) serão preenchidas
                automaticamente. Pressione o botão 'Incluir banheiro' para
                incluí-lo.
              </p>
              <p>
                Para alterar um banheiro, clique em seu ícone no mapa.
                Pressione o botão 'Alterar banheiro' para alterá-lo.
                Para excluir um banheiro, clique no 'x' correspondente na
                tabela.
                Você só pode alterar ou excluir os banheiros que você incluiu.
              </p>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Retornar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
