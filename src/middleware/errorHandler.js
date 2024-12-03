import { errors } from '../utils/errors.js';
import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  // Verifica si el error tiene un tipo y si está en el diccionario de errores
  if (err.type && errors[err.type]) {
    const error = errors[err.type];
    logger.error(`Error ${error.code}: ${error.error}`);
    return res.status(error.code || 500).send({
      status: 'error',
      error: error.error
    });
  }
  logger.error(`Unknown error: ${err}`);
  // Si el error no tiene tipo, es un error general del servidor
  res.status(500).send({
    status: 'error',
    error: 'Internal server error'
  });
};
