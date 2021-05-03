FROM node:12

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

EXPOSE 4050
EXPOSE 3050

CMD ["npm", "run", "start"]
