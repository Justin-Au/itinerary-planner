# Itinerary Planner

A comprehensive travel itinerary planning application with web and mobile interfaces.

## Project Structure

This project is structured as a monorepo with the following components:

- `/apps/backend` - Node.js/Express server with TypeScript
- `/apps/frontend-web` - React web application with TypeScript
- `/apps/frontend-mobile` - React Native (Expo) mobile application with TypeScript
- `/packages/db` - Shared database package with Prisma ORM

## Getting Started

### Prerequisites

- Node.js (v16+)
- pnpm
- PostgreSQL

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` and update the values as needed

### Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Push schema changes to the database
pnpm db:push

# Seed the database with sample data
pnpm db:seed
```

## Running the Applications

### Backend

```bash
pnpm dev:backend
```

The server will start on port 5000. Access the health check endpoint at http://localhost:5000/health

### Web Frontend

```bash
pnpm dev:web
```

The web application will start on port 3000. Access it at http://localhost:3000

### Mobile Frontend

```bash
pnpm dev:mobile
```

This will start the Expo development server. You can run the app in:
- A development build
- Android emulator
- iOS simulator
- Expo Go app

## Building for Production

### Backend

```bash
pnpm build:backend
```

### Web Frontend

```bash
pnpm build:web
```

The build will be created in the `apps/frontend-web/build` folder, ready for deployment.

## Learn More

### Web Frontend

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)

### Mobile Frontend

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/)
- [Expo Router documentation](https://docs.expo.dev/router/introduction)
