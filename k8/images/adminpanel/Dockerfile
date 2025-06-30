# Etapa 1: build
FROM node:20-alpine AS builder
WORKDIR /app

# Copia o projeto
COPY . .

ARG DRIVEAPP_API_URL_INTERNAL
ENV DRIVEAPP_API_URL_INTERNAL=${DRIVEAPP_API_URL_INTERNAL}

RUN export DRIVEAPP_API_URL_INTERNAL=${DRIVEAPP_API_URL_INTERNAL} && node -e "console.log(process.env.DRIVEAPP_API_URL_INTERNAL)"
RUN yarn install
RUN yarn build --filter=@driveapp/adminpanelv2
RUN ls -la ./apps/adminpanelv2/.next/standalone/

# Etapa 2: imagem final
FROM node:20-alpine
WORKDIR /app

ARG DRIVEAPP_API_URL_INTERNAL
ENV DRIVEAPP_API_URL_INTERNAL=${DRIVEAPP_API_URL_INTERNAL}

# Copia apenas o necessário da build
COPY --from=builder /app/apps/adminpanelv2/.next/standalone ./
COPY --from=builder /app/apps/adminpanelv2/public ./apps/adminpanelv2/public
COPY --from=builder /app/apps/adminpanelv2/.next/static ./apps/adminpanelv2/.next/static



EXPOSE 3000

CMD ["node", "apps/adminpanelv2/server.js"]
