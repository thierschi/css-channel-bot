FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN cd /tmp &&\
    wget https://github.com/libvips/libvips/releases/download/v8.10.1/vips-8.10.1.tar.gz &&\
    tar xf vips-8.10.0.tar.gz &&\
    cd vips-8.9.2 &&\
    ./configure &&\
    make &&\
    make install &&\
    ldconfig

RUN npm install

COPY . .

CMD ["node", "."]