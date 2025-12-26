import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'src/infrastructure/persistence/prisma/schema.prisma',
  migrations: {
    path: 'src/infrastructure/persistence/prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
