import L from "leaflet";

export function getUserName(userList, email) {
  const userFound = userList.find((element) => element.email === email);
  if (userFound) {
    return userFound.firstname + " " + userFound.lastname;
  } else {
    return "???????";
  }
}

export function atualizaDistancias(lista, currentPosition) {
  // Calcula a distância entre a posição indicada no mapa e um banheiro
  const calculaDistancia = (latitude, longitude) => {
    if (currentPosition) {
      let posicaoBanheiro = L.latLng(latitude, longitude);
      let distancia = posicaoBanheiro.distanceTo(currentPosition);
      return distancia;
    } else {
      return -1;
    }
  };

  let distancias = [];
  for (var i = 0; i < lista.length; i++) {
    let distancia = calculaDistancia(lista[i].latitude, lista[i].longitude);
    distancias.push(distancia);
  }
  return distancias;
}
