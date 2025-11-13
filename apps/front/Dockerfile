FROM node:22-alpine

WORKDIR /app

# Copier les fichiers de configuration pnpm
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Installer pnpm
RUN npm install -g pnpm

# Pré-copier les manifests nécessaires pour optimiser le cache
COPY packages/shared-ui/package.json ./packages/shared-ui/package.json
COPY packages/types/package.json ./packages/types/package.json
COPY apps/front/package.json ./apps/front/package.json

# Installer les dépendances de l'application front et de ses workspaces liés
RUN pnpm install --filter @admin-dashboard/front... --frozen-lockfile

# Copier le reste des sources
COPY . .

WORKDIR /app/apps/front

EXPOSE 3000

CMD ["pnpm", "dev"]
