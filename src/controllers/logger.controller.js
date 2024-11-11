import logger from "../utils/logger.js";

export const getLogger = async (req, res) => {
    logger.debug('This is a debug message');
    logger.http('This is an HTTP request message');
    logger.info('This is an info message');
    logger.warning('This is a warning message');
    logger.error('This is an error message');
    logger.fatal('This is a fatal error message');

    res.send('Logger test completed');
};