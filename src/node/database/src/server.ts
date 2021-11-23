import express from 'express';
import { Environment } from './env/env';
import { Logger } from './logging/logger';
import { DBStore } from './store/db-store';

const logger = new Logger('server');
const env = new Environment();
if (env.validKeys()) {
  logger.info('main', 'Setting up DB-Store server..');
  const store = new DBStore();
  store.connect(env.DATABASE_URI).then((connection) => {
    logger.info('DBStore', `Successfully connected to database: ${env.DATABASE_URI}`);
    const server = express();
    server.use(express.json({ limit: '50mb' }));
    server.use(express.urlencoded({ extended: true, limit: '50mb' }));

    /**
     * DB-Store realtime GET request
     */
    server.get('/realtime', (req, res) => {
      logger.info('main', `Receive GET request - ${req.url}`);
      store.getAllRealtime().then((data) => {
        logger.info('main', 'Successfully retrieved realtime data from the database');
        res.status(200).json(data);
      }).catch((err) => {
        logger.critical('main', 'An error occurred retrieving realtime data from the database', err);
        res.status(500).json(err);
      });
    });

    /**
     * DB-Store realtime POST request
     */
    server.post('/historical', (req, res) => {
      logger.info('main', `Receive POST request - ${req.url}`);
      store.writeHistorical(req.body).then((result) => {
        logger.info('main', 'Successfully wrote historical data to the database');
        res.status(200).json(result);
      }).catch((err) => {
        logger.critical('main', 'An error occurred writing historical data to the database', err);
        res.status(500).json(err);
      });
    });

    /**
     * DB-Store realtime DELETE request
     */
    server.delete('/historical', (req, res) => {
      logger.info('main', `Receive DELETE request - ${req.url}`);
      store.deleteAllHistorical().then((result) => {
        logger.info('main', 'Successfully deleted historical data from the database');
        res.status(200).json(result);
      }).catch((err) => {
        logger.critical('main', 'An error occurred deleting historical data from the database', err);
        res.status(500).json(err);
      });
    });

    /**
     * DB-Store historical GET request
     */
    server.get('/historical', (req, res) => {
      logger.info('main', `Receive GET request - ${req.url}`);
      store.getAllHistorical().then((data) => {
        logger.info('main', 'Successfully retrieved historical data from the database');
        res.status(200).json(data);
      }).catch((err) => {
        logger.critical('main', 'An error occurred retrieving historical data from the database', err);
        res.status(500).json(err);
      });
    });

    /**
     * DB-Store realtime POST request
     */
    server.post('/realtime', (req, res) => {
      logger.info('main', `Receive POST request - ${req.url}`);
      store.writeRealtime(req.body).then((result) => {
        logger.info('main', 'Successfully rated and wrote realtime data to the database');
        res.status(200).json(result);
      }).catch((err) => {
        logger.critical('main', 'An error occurred rating and/or writing realtime data to the database', err);
        res.status(500).json(err);
      });
    });

    /**
     * DB-Store realtime DELETE request
     */
    server.delete('/realtime', (req, res) => {
      logger.info('main', `Receive DELETE request - ${req.url}`);
      store.deleteAllRealtime().then((result) => {
        logger.info('main', 'Successfully deleted realtime data from the database');
        res.status(200).json(result);
      }).catch((err) => {
        logger.critical('main', 'An error occurred deleting realtime data from the database', err);
        res.status(500).json(err);
      });
    });

    server.listen(env.DB_STORE_PORT, () => {
      logger.info('main', `Server is up and listening on port: ${env.DB_STORE_PORT}`);
    });
  }).catch((connectErr) => {
    logger.critical('DBStore', `Unable to connect to database. Please verify database is up and restart DB-Store server`, connectErr);
  });
}
