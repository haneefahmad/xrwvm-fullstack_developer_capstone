FROM node:18.12.1-bullseye-slim

RUN npm install -g npm@9.1.3

WORKDIR /app

COPY package.json /app/
COPY app.js /app/
COPY car_records.json /app/
COPY inventory.js /app/
COPY . /app/

RUN npm install

EXPOSE 3050

CMD ["node", "app.js"]
