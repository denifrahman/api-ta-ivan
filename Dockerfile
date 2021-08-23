FROM node:lts-alpine3.14

#create app directory, ini container dari images
WORKDIR /src/app

# install app dependency
COPY package*.json ./

RUN npm install
# if you are building code for production 
# Run npm  ci --only=production

#bundle app source

COPY . .

EXPOSE 3000

CMD [ "node", "server" ]