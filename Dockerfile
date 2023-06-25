FROM node:16-alpine
WORKDIR /app
COPY package.json /app
RUN yarn install
COPY . /app
EXPOSE 3000 
CMD ["yarn", "start"]