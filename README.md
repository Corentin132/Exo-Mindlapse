# Admin Dashboard - Monorepo

Projet monorepo avec pnpm workspaces contenant :
- **Frontend** : React + TypeScript + Vite + ESLint + Vitest
- **Backend** : AdonisJS + Vitest + ESLint
- **Database** : PostgreSQL

## 🚀 Démarrage rapide

### Prérequis
- Node.js >= 20
- pnpm >= 8
- Docker et Docker Compose

### Installation

```bash
# Installer les dépendances
pnpm install
```

### Lancer le projet avec Docker Compose

```bash
# Démarrer tous les services (Frontend, Backend, PostgreSQL)
pnpm dev

# Ou avec rebuild des images
pnpm dev:build

# Arrêter les services
pnpm down

# Arrêter et supprimer les volumes (nettoie la base de données)
pnpm down:clean
```

### Développement local (sans Docker)

```bash
# Frontend (port 3000)
pnpm front:dev

# Backend (port 3333)
pnpm api:dev
```

## 📦 Structure du projet

```
admin-dashboard/
├── apps/
│   ├── front/          # Application React
│   │   ├── src/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── api/            # API AdonisJS
│       ├── app/
│       ├── config/
│       ├── database/
│       ├── start/
│       ├── Dockerfile
│       └── package.json
├── packages/           # Packages partagés (futurs)
├── docker-compose.yml
├── pnpm-workspace.yaml
└── package.json
```

## 🧪 Tests

```bash
# Tests Frontend
pnpm front:test

# Tests Backend
pnpm api:test
```

## 🔍 Linting

```bash
# Lint Frontend
pnpm front:lint

# Lint Backend
pnpm api:lint
```

## 🌐 URLs d'accès

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3333
- **PostgreSQL** : localhost:5432

## 🗄️ Base de données

Identifiants PostgreSQL par défaut :
- **User** : admin
- **Password** : admin123
- **Database** : admin_dashboard
- **Port** : 5432

## 📝 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Lance tous les services avec Docker Compose |
| `pnpm dev:build` | Lance tous les services en rebuilding les images |
| `pnpm down` | Arrête les services Docker |
| `pnpm down:clean` | Arrête les services et supprime les volumes |
| `pnpm front:dev` | Lance le frontend en dev |
| `pnpm front:build` | Build le frontend |
| `pnpm front:test` | Lance les tests frontend |
| `pnpm front:lint` | Lint le frontend |
| `pnpm api:dev` | Lance l'API en dev |
| `pnpm api:build` | Build l'API |
| `pnpm api:test` | Lance les tests API |
| `pnpm api:lint` | Lint l'API |

## 🛠️ Technologies

### Frontend
- React 18
- TypeScript
- Vite
- ESLint
- Vitest + Testing Library

### Backend
- AdonisJS 6
- TypeScript
- Lucid ORM
- Vitest
- ESLint

### Database
- PostgreSQL 16

## 📄 License

ISC
