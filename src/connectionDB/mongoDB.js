import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.USE_DB });
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
