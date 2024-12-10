import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

// Definir los niveles de log
const logLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warning: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
  }
};

// Configuración para desarrollo (solo consola)
const devLogger = winston.createLogger({
  levels: logLevels.levels,
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize({ colors: logLevels.colors }),
        winston.format.simple()
      )
    })
  ]
});

// Configuración para producción
const prodLogger = winston.createLogger({
  levels: logLevels.levels,
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize({ colors: logLevels.colors }),
        winston.format.simple()
      )
    })
  ]
});

// Si NODE_ENV es 'production', agregar el transporte de archivo
if (process.env.NODE_ENV === 'production') {
  prodLogger.add(
    new winston.transports.File({
      filename: 'errors_prod.log',
      level: 'error',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json())
    })
  );
}

// Asignar el logger según el entorno
const environment = process.env.NODE_ENV || 'development';
const logger = environment === 'production' ? prodLogger : devLogger;

export default logger;
