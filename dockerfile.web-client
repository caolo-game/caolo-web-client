FROM node:12.2.0-alpine

EXPOSE 3000

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

RUN npm install -g yarn
RUN npm install -g http-server

COPY . .
RUN yarn install 
RUN ls -al
RUN yarn build

WORKDIR /app/build/
CMD http-server -p 3000 -a 0.0.0.0
