import { envBool, envInt, envString } from './utils/config-utils'

require('dotenv').config()

let configObject

function loadConfig() {
  return {
    serverPort: envInt('PORT', 3000),
    logLevel: process.env.LOG_LEVEL || 'debug',
    db: {
      type: 'postgres' as const,
      enabled: envBool('DB_ENABLE'),
      host: envString('DB_HOST'),
      port: envInt('DB_PORT', 5432),
      username: envString('DB_USERNAME'),
      password: envString('DB_PASSWORD'),
      database: envString('DB_DATABASE_NAME'),
      logging: envBool('DB_LOGGING'),
      cache: envBool('DB_CACHE', false),
      synchronize: envBool('DB_SYNCHRONIZE', false),
      dropSchema: envBool('DB_DROP_SCHEMA', false),
    },
    logPretty: envBool('LOG_PRETTY_PRINT'),
    userUuid: envString('USER_UUID'),
  }
}

export type ConfigType = ReturnType<typeof loadConfig>

export default function config(): ConfigType {
  if (!configObject) {
    configObject = loadConfig()
  }

  return configObject
}
