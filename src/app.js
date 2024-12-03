import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './utils/swaggerConfig.js';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import loggerRouter from './routes/logger.router.js';
import connectDB from './connectionDB/mongoDB.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import logRequest from './middleware/loggerMiddleware.js';

dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser(process.env.SECRET));

app.use(logRequest);

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);
app.use('/', loggerRouter);

app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use(errorHandler);

app.listen(PORT, () => logger.info(`Server is listening on ${PORT}`));
