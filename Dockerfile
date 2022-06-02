FROM node:17-alpine

WORKDIR /app/

COPY frontend frontend
COPY server server

WORKDIR /app/frontend/

RUN npm install
RUN npm run build

WORKDIR /app/server/

RUN npm install
RUN npm run build

EXPOSE 8080
CMD ["node", "."]
