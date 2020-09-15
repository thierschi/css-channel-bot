FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update && apt-get install -y libvips-dev --no-install-recommends
RUN npm install

COPY . .

CMD ["node", "."]