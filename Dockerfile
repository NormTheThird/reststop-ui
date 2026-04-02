FROM node:22-alpine AS build
ARG VITE_API_URL=http://10.47.1.110:30421
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN VITE_API_URL=$VITE_API_URL npm run build

FROM nginx:alpine AS final
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
