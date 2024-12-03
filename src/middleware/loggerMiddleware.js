import logger from '../utils/logger.js';

// Middleware para registrar las peticiones
const logRequest = (req, res, next) => {
  logger.http(`${req.method} ${req.url}`);

  next();
};

export default logRequest;
