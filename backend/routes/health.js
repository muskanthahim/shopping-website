import express from 'express';
import { checkDatabaseConnection } from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const dbStatus = await checkDatabaseConnection();

  if (dbStatus.connected) {
    res.json({
      status: 'OK',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(503).json({
      status: 'SERVICE_UNAVAILABLE',
      database: 'disconnected',
      message: 'Unable to connect to the database. Please make sure MySQL is running.',
      error: dbStatus.error
    });
  }
});

export default router;
