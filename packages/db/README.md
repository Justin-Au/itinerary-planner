# Database Package

This package contains the Prisma ORM setup and database schema for the Itinerary Planner application.

## Structure

- `src/prisma/schema/schema.prisma`: The main Prisma schema file
- `prisma/seed.ts`: Database seeding script

## Usage

Import the Prisma client in your application:

```typescript
import { prisma } from 'db';
```

## Commands

- `npm run db:generate`: Generate Prisma client
- `npm run db:push`: Push schema changes to the database
- `npm run db:seed`: Seed the database with sample data
- `npm run build`: Build the package
