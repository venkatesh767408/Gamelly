FROM node:20 AS build

WORKDIR /app

ARG VITE_PROFILE_API_URL
ARG VITE_AUTH_API_URL

ENV VITE_PROFILE_API_URL=$VITE_PROFILE_API_URL
ENV VITE_AUTH_API_URL=$VITE_AUTH_API_URL

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# --- Stage 2: Serve with NGINX ---
FROM nginx:alpine

# Copy built frontend
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
