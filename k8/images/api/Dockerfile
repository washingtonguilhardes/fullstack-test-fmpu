# Etapa 1: build
FROM node:20-alpine AS builder
WORKDIR /app

# Copia o projeto
COPY . .

# Garante que não há sobras do ambiente local
RUN rm -rf node_modules packages/datasource/generated packages/datasource/node_modules

RUN npm install -g turbo
RUN yarn install

# ⚠️ Prisma precisa ser gerado no ambiente Linux do container
RUN yarn --cwd packages/datasource prisma generate

# Roda build do monorepo (compila TS e outras libs)
RUN turbo run build --filter=@driveapp/api --filter=@driveapp/datasource

# Etapa 2: imagem final
FROM node:20-alpine
WORKDIR /app

# Copia apenas o necessário da build
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/packages/datasource/generated ./packages/datasource/generated
RUN yarn --cwd packages/datasource prisma generate


CMD ["node", "dist/src/main"]
