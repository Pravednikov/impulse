import { registerAs } from '@nestjs/config';

export default registerAs(
  'env',
  () =>
    ({
      port: process.env.PORT || 3000,
      pgadminDefaultEmail: process.env.PGADMIN_DEFAULT_EMAIL,
      pgadminDefaultPassword: process.env.PGADMIN_DEFAULT_PASSWORD,
      postgresDb: process.env.POSTGRES_DB || 'impulse',
      postgresHost: process.env.POSTGRES_HOST || 'postgres',
      postgresPassword: process.env.POSTGRES_PASSWORD || 'postgres',
      postgresPort: process.env.POSTGRES_PORT || 5432,
      postgresUser: process.env.POSTGRES_USER || 'postgres',
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresInAccess: process.env.EXPIRES_IN_ACCESS,
      expiresInRefresh: process.env.EXPIRES_IN_REFRESH,
      throttleTtl: process.env.THROTTLE_TTL || 10_000,
      throttleLimit: process.env.THROTTLE_LIMIT || 2,
    }) as const,
);
