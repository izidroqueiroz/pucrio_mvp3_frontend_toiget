# PUC Rio - Pós-Graduação em Desenvolvimento Full Stack
### Sprint: Desenvolvimento Back-End Avançado
### Aluno: Izidro Avelino de Queiroz Neto
### Abril/2024

## ToiGet Front-End

O objetivo da aplicação ("batizada" de ToiGet, uma brincadeira com a palavra "toilet") é encontrar o banheiro mais próximo da localização do usuário. No mapa, é indicado o banheiro mais próximo com o ícone em vermelho (os outros banheiros são verdes). O ícone em azul indica a localização de referência, que pode ser arrastado no mapa, ajustando a cor do banheiro mais próximo.

Para incluir um banheiro, basta clicar na sua localização no mapa e preencher sua classificação (uma a cinco estrelas), uma descrição (opcional) e indicar se é público ou pago. Também deve ser informado o horário de funcionamento por dia da semana (se está aberto ou fechado e, quando aberto, a hora em que abre e em que fecha).

Para alterar um banheiro, basta clicar em seu ícone no mapa. Suas informações serão recuperadas e poderão ser alteradas e salvas.

Abaixo do mapa, é apresentada uma tabela com os banheiros cadastrados, em ordem crescente de distância em relação à localização de referência.

Para excluir um banheiro, basta clicar no ícone de exclusão na coluna mais à direita da tabela.

Cada usuário pode ter um dos seguintes papéis: 'user' ou 'admin'. Um 'user' pode alterar ou excluir apenas os banheiros que ele tenha incluído. Um 'admin' pode alterar ou excluir qualquer banheiro.

A aplicação original foi desenvolvida como MVP da Sprint Desenvolvimento Front-End Avançado, em dez/2023.

A aplicação usa [React](https://react.dev/) e [React Boostrap](https://react-bootstrap.netlify.app/). Utiliza os componentes [React Leaflet](https://react-leaflet.js.org/), que integram a biblioteca Javascript [Leaflet](https://leafletjs.com/) ao React. Essa biblioteca usa o serviço externo [OpenStreetMap](https://www.openstreetmap.org), que fornece dados de mapas.

A aplicação também usa duas APIs, desenvolvidas simultaneamente, no contexto desse MVP:

**Toilets API**: fornece as funções de inclusão, alteração, exclusão e consulta de banheiros, via REST, utilizando SQLite.

**Users API**: fornece as funções de inclusão, exclusão e consulta de usuários, via REST, utilizando SQLite.

A aplicação utiliza as seguintes rotas:

http://localhost:5000/toilets - GET - lista de banheiros cadastrados (JSON).

http://localhost:5000/toilet - POST - inclui um banheiro.

http://localhost:5000/toiletEdit - POST - altera um banheiro.

http://localhost:5000/toilet - DELETE - exclui um banheiro.

http://localhost:5001/users - GET - lista dos usuários cadastrados (JSON).

# Diagrama com os componentes da aplicação
![Diagrama com os componentes da aplicação](/PUC_MVP3.png)

---
# Como executar

Certifique-se de ter o [Docker](https://docs.docker.com/engine/install/) instalado e em execução em sua máquina.

Fazer o download das duas APIs (ver instruções de instalação nos respectivos arquivos README):

[Toilets API](https://github.com/izidroqueiroz/pucrio_mvp3_API_toilets)

[Users API](https://github.com/izidroqueiroz/pucrio_mvp3_API_users)

Fazer o download do projeto. Navegue até o diretório que contém o Dockerfile e o package.json no terminal. Execute **como administrador** o seguinte comando para construir a imagem Docker:

```
$ docker build -t toiget:latest .
```

Uma vez criada a imagem, para executar o container basta executar, **como administrador**, o seguinte comando:

```
$ docker run -p 3000:3000 --name toiget toiget:latest
```

Uma vez executando, para acessar a aplicação, basta abrir o [http://localhost:3000/#/](http://localhost:3000/#/) no navegador.

Os usuários e senhas de exemplo estão listados no arquivo 'users.json'.

## Bibliotecas utilizadas:

[Leaflet](https://leafletjs.com/): biblioteca Javascript open source para desenho do mapas.

[React Leaflet](https://react-leaflet.js.org/): componentes React que integram o Leaflet ao React.

[React Boostrap](https://react-bootstrap.netlify.app/): componentes React para uso da biblioteca Bootstrap.

## MVP da Sprint Desenvolvimento Front-End Avançado:

[MVP2 ToiGet Front-End](https://github.com/izidroqueiroz/pucrio_mvp2)
