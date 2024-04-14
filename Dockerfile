# Define a imagem base
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /toiget

# Copia os arquivos da aplicação para o diretório de trabalho
COPY public/ /toiget/public
COPY src/ /toiget/src
COPY package.json /toiget/

# Instalação
RUN npm install

# Define o comando de execução do front end
CMD ["npm", "start"]
