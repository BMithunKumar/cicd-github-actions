#Stage1 build stage
FROM node:alpine AS build

WORKDIR /app

COPY   package*.json .

RUN npm install

COPY . .

RUN npm run build


#Stage 2 run stage
FROM nginx:alpine 

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx" , "-g" , "daemon off;"]