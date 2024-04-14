import React, { useState, createContext, useContext, useEffect } from "react";

import { atualizaDistancias } from "../util/utils";

const userAuthContext = createContext();

const fakeAuth = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve("2342f2f1d131rf12"), 250);
  });

// Componente de contexto

export default function ToiGetProvider({ children }) {
  const [token, setToken] = useState(null); // Indica se há um usuário logado
  const [userList, setUserList] = useState(null); // lista de usuários (via JSON)
  const [user, setUser] = useState(null); // Se há um usuário logado, contém suas propriedades

  const [toiletList, setToiletList] = useState(null); // lista de banheiros (versão inicial, via JSON)
  const [distanceList, setDistanceList] = useState([]); // distâncias em relação ao ponto de referência
  const [currentPosition, setCurrentPosition] = useState(null); // ponto de referência para o cálculo das distâncias
  const [toiletPosition, setToiletPosition] = useState(null); // posição do banheiro que será incluído ou alterado

  const [insertMode, setInsertMode] = useState(false); // indica se há uma inclusão em andamento
  const [insertError, setInsertError] = useState(false); // indica se há um erro que impede a inclusão de um banheiro
  const [updateMode, setUpdateMode] = useState(false); // indica se há uma alteração em andamento
  const [updateError, setUpdateError] = useState(false); // indica se há um erro que impede a alteração de um banheiro
  const [updateAuthorizationError, setUpdateAuthorizationError] =
    useState(false);
  // indica se há um erro que impede a alteração de um banheiro por falta de autorização

  useEffect(() => {
    if (currentPosition) {
      // se a posição de referência ou a lista de banheiros mudou, atualiza as distâncias
      localStorage.setItem("currentPosition", JSON.stringify(currentPosition));
      localStorage.setItem("toiletList", JSON.stringify(toiletList));
      setDistanceList(() => atualizaDistancias(toiletList, currentPosition));
    }
  }, [currentPosition, toiletList]);

  useEffect(() => {
    // guarda o token do usuário logado
    if (token) {
      localStorage.setItem("token", JSON.stringify(token));
    }
  }, [token]);

  useEffect(() => {
    /* Inicialização da lista de banheiros e da lista de usuários */
    const getToilets = async () => {
      // Obtém a lista de banheiros
      let toilets = [];
      let url = "http://127.0.0.1:5000/toilets";
      fetch(url, {
        method: "get",
      })
        .then((response) => response.json())
        .then((data) => {
          data.toilets.forEach((toilet) => {
            var toiletX = toilet.toilet[0];
            var openingHours = toilet.toilet[1].openingHours;
            var horarios = [];
            for (var i = 0; i < openingHours.length; i++) {
              horarios.push({
                weekday: openingHours[i].weekday,
                openClosed: openingHours[i].openClosed,
                openingTime: openingHours[i].openingTime,
                closingTime: openingHours[i].closingTime,
              });
            }
            toilets.push({
              latitude: toiletX.latitude,
              longitude: toiletX.longitude,
              classification: toiletX.classification,
              description: toiletX.description,
              toiletType: toiletX.toiletType,
              user: toiletX.user,
              openingHours: horarios,
            });
          });
          setToiletList(() => toilets);
          localStorage.setItem("toiletList", JSON.stringify(toilets));
          if (currentPosition) {
            setDistanceList(() => atualizaDistancias(toilets, currentPosition));
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      return;
    };

    const getUsers = async () => {
      // Obtém a lista de usuários
      let users = [];
      let url = "http://127.0.0.1:5001/users";
      fetch(url, {
        method: "get",
      })
        .then((response) => response.json())
        .then((data) => {
          data.users.forEach((user) => {
            var userX = user.user[0];
            users.push({
              firstname: userX.firstname,
              lastname: userX.lastname,
              email: userX.email,
              password: userX.password,
              role: userX.role,
            });
          });
          setUserList(() => users);
          localStorage.setItem("userList", JSON.stringify(users));
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      return;
    };

    const token = JSON.parse(localStorage.getItem("token")); // recupera o token do usuário logado, caso exista
    if (token) {
      setToken(token);
    }
    const currentPosition = JSON.parse(localStorage.getItem("currentPosition")); // posição de referência
    if (currentPosition) {
      setCurrentPosition(() => currentPosition);
    } else {
      setCurrentPosition(() => [-23.004678325889472, -43.31867551816686]);
    }
    var toiletList = JSON.parse(localStorage.getItem("toiletList")); // lista de banheiros atual
    if (toiletList) {
      setToiletList(() => toiletList);
      if (!(currentPosition == null)) {
        setDistanceList(() => atualizaDistancias(toiletList, currentPosition));
      }
    } else {
      let toiletList = [];
      getToilets();
      setToiletList(() => toiletList);
      localStorage.setItem("toiletList", JSON.stringify(toiletList));
      if (currentPosition) {
        setDistanceList(() => atualizaDistancias(toiletList, currentPosition));
      }
    }
    var userList = JSON.parse(localStorage.getItem("userList")); // lista de usuários
    if (userList) {
      setUserList(() => userList);
    } else {
      let userList = [];
      getUsers();
      setUserList(() => userList);
      localStorage.setItem("userList", JSON.stringify(userList));
    }
  }, []);

  const handleLogin = async () => {
    // login "fake"
    const token = await fakeAuth();
    setToken(token);
  };

  const handleLogout = () => {
    // processamento do logout
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setInsertMode(() => false);
    setUpdateMode(() => false);
  };

  const value = {
    // lista de propriedades compartilhadas entre os componentes
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
    userList,
    setUserList,
    toiletList,
    setToiletList,
    currentPosition,
    setCurrentPosition,
    toiletPosition,
    setToiletPosition,
    distanceList,
    setDistanceList,
    insertMode,
    setInsertMode,
    insertError,
    setInsertError,
    updateMode,
    setUpdateMode,
    updateError,
    setUpdateError,
    updateAuthorizationError,
    setUpdateAuthorizationError,
    user,
    setUser,
  };

  return (
    <userAuthContext.Provider value={value}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useToiGet() {
  return useContext(userAuthContext);
}
