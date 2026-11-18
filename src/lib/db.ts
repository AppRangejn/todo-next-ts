import pg from 'pg';
import { Options, Sequelize } from 'sequelize';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const configFile = require('@/config/postgresConfig.js');

const env = (process.env.NODE_ENV || 'development') as
  | 'development'
  | 'test'
  | 'production';

const config = configFile[env] as Options & { use_env_variable?: string };

const globalForSequelize = globalThis as unknown as {
  sequelize: Sequelize | undefined;
};

const initSequelize = (): Sequelize => {
  const options: Options = {
    ...config,
    dialect: 'postgres',
    dialectModule: pg,
    logging: false,
  };

  if (config.use_env_variable && process.env[config.use_env_variable]) {
    return new Sequelize(
      process.env[config.use_env_variable] as string,
      options,
    );
  }

  return new Sequelize(
    config.database as string,
    config.username as string,
    config.password as string,
    options,
  );
};

export const sequelize = globalForSequelize.sequelize ?? initSequelize();

if (process.env.NODE_ENV !== 'production') {
  globalForSequelize.sequelize = sequelize;
}
