import L from "leaflet";
import { Marker } from "react-leaflet";
import { useToiGet } from "./ToiGetProvider";

// Ícone de um banheiro
// - verde: banheiro existente na tabela de banheiros
// - azul: banheiro a ser incluído ou alterado
// - vermelho: banheiro mais próximo do ponto de referência

function ToiletIcon(props) {
  const position = [props.latitude, props.longitude];
  const {
    setToiletPosition,
    setUpdateMode,
    user,
    setUpdateError,
    setUpdateAuthorizationError,
    distanceList,
  } = useToiGet();

  let toiletIcon = L.icon({
    iconUrl: require("../assets/toilet-" + corToilet() + ".png"),
    iconSize: [32, 32],
  });

  function menorDistanciaIndex() {
    let index = 0;
    let menor = distanceList[index];
    for (let i = index + 1; i < distanceList.length; i++) {
      if (distanceList[i] < menor) {
        index = i;
        menor = distanceList[i];
      }
    }
    return index;
  }

  function corToilet() {
    if (props.index === menorDistanciaIndex()) {
      return "red";
    } else {
      return "green";
    }
  }

  return (
    <Marker
      position={position}
      icon={toiletIcon}
      eventHandlers={{
        click: (e) => {
          if (user) {
            if (user.email === props.toiletUser || user.role === "admin") {
              setToiletPosition(() => e.latlng);
              setUpdateMode(() => true);
            } else {
              setUpdateAuthorizationError(() => true);
            }
          } else {
            setUpdateError(() => true);
          }
        },
      }}
    />
  );
}

export default ToiletIcon;
