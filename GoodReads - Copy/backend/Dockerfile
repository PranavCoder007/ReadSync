FROM ubuntu

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get upgrade -y
RUN apt-get install -y nodejs

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY app.js app.js
COPY populate.js populate.js
COPY scrape.js scrape.js
COPY .env .env
COPY routes/user.js routes/user.js
COPY db/models/user.js db/models/user.js
COPY db/models/book.js db/models/book.js
COPY db/connection.js db/connection.js
COPY middleware/auth.js middleware/auth.js
COPY routes/user.js routes/user.js


RUN npm install
EXPOSE 8000
ENTRYPOINT [ "node", "app.js" ]