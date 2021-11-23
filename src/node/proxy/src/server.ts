import needle from 'needle';
import express from 'express';
import { Environment } from './env/env';
import { Logger } from './logging/logger';

const logger = new Logger('server');
const env = new Environment();
if (env.validKeys()) {
  const server = express();
  server.use(express.json({ limit: '50mb' }));
  server.use(express.urlencoded({ extended: true, limit: '50mb' }));

  /**
   * Historical GET proxy
   */
  server.get('/historical', (req, res) => {
    logger.info('main', `Receive GET request - ${req.url}`);
    req.url = req.url.replace('/historical', '');
    const url = `http://${env.HISTORICAL_SERVER_HOSTNAME}:${env.HISTORICAL_SERVER_PORT}/`;

    try {
      needle.get(url, (err, _res) => {
        if (err) {
          const message = 'An error occurred proxying the GET request to the historical server';
          logger.critical('main', message, err);
          res.status(500).json(message);
        }
        else {
          logger.info('main', 'Successfully proxied GET request to the historical server');
          res.status(200).json(_res.body);
        }
      });
    }
    catch (ex) {
      const message = 'An error occurred proxying the GET request to the historical server';
      logger.critical('main', message, ex);
      res.status(500).json(message);
    }
  });

  /**
   * Historical POST proxy
   */
  server.post('/historical', (req, res) => {
    logger.info('main', `Receive POST request - ${req.url}`);
    req.url = req.url.replace('/historical', '');
    const url = `http://${env.HISTORICAL_SERVER_HOSTNAME}:${env.HISTORICAL_SERVER_PORT}/`;

    try {
      needle.post(url, req.body, { json: true }, (err, _res) => {
        if (err) {
          const message = 'An error occurred proxying the POST request to the historical server';
          logger.critical('main', message, err);
          res.status(500).json(message);
        }
        else {
          logger.info('main', 'Successfully proxied POST request to the historical server');
          res.status(200).json(_res.body);
        }
      });
    }
    catch (ex) {
      const message = 'An error occurred proxying the POST request to the historical server';
      logger.critical('main', message, ex);
      res.status(500).json(message);
    }
  });

  /**
   * Historical DELETE proxy
   */
  server.delete('/historical', (req, res) => {
    logger.info('main', `Receive DELETE request - ${req.url}`);
    req.url = req.url.replace('/historical', '');
    const url = `http://${env.HISTORICAL_SERVER_HOSTNAME}:${env.HISTORICAL_SERVER_PORT}/`;

    try {
      needle.delete(url, {}, (err, _res) => {
        if (err) {
          const message = 'An error occurred proxying the DELETE request to the historical server';
          logger.critical('main', message, err);
          res.status(500).json(message);
        }
        else {
          logger.info('main', 'Successfully proxied DELETE request to the historical server');
          res.status(200).json(_res.body);
        }
      });
    }
    catch (ex) {
      const message = 'An error occurred proxying the DELETE request to the historical server';
      logger.critical('main', message, ex);
      res.status(500).json(message);
    }
  });

  /**
   * Realtime GET proxy
   */
  server.get('/realtime', (req, res) => {
    logger.info('main', `Receive GET request - ${req.url}`);
    req.url = req.url.replace('/realtime', '');
    const url = `http://${env.REALTIME_SERVER_HOSTNAME}:${env.REALTIME_SERVER_PORT}/`;

    try {
      needle.get(url, (err, _res) => {
        if (err) {
          const message = 'An error occurred proxying the GET request to the realtime server';
          logger.critical('main', message, err);
          res.status(500).json(message);
        }
        else {
          logger.info('main', 'Successfully proxied GET request to the realtime server');
          res.status(200).json(_res.body);
        }
      });
    }
    catch (ex) {
      const message = 'An error occurred proxying the GET request to the realtime server';
      logger.critical('main', message, ex);
      res.status(500).json(message);
    }
  });

  /**
   * Realtime POST proxy
   */
  server.post('/realtime', (req, res) => {
    logger.info('main', `Receive POST request - ${req.url}`);
    const url = `http://${env.REALTIME_SERVER_HOSTNAME}:${env.REALTIME_SERVER_PORT}/`;

    try {
      needle.post(url, req.body, { json: true }, (err, _res) => {
        if (err) {
          const message = 'An error occurred proxying the POST request to the realtime server';
          logger.critical('main', message, err);
          res.status(500).json(message);
        }
        else {
          logger.info('main', 'Successfully proxied POST request to the realtime server');
          res.status(200).json(_res.body);
        }
      });
    }
    catch (ex) {
      const message = 'An error occurred proxying the POST request to the realtime server';
      logger.critical('main', message, ex);
      res.status(500).json(message);
    }
  });

  server.listen(env.PROXY_PORT, () => {
    logger.info('main', `Server is up and listening on port: ${env.PROXY_PORT}`);
  });

  /**
   * Realtime DELETE proxy
   */
  server.delete('/realtime', (req, res) => {
    logger.info('main', `Receive DELETE request - ${req.url}`);
    req.url = req.url.replace('/realtime', '');
    const url = `http://${env.REALTIME_SERVER_HOSTNAME}:${env.REALTIME_SERVER_PORT}/`;

    try {
      needle.delete(url, {}, (err, _res) => {
        if (err) {
          const message = 'An error occurred proxying the DELETE request to the realtime server';
          logger.critical('main', message, err);
          res.status(500).json(message);
        }
        else {
          logger.info('main', 'Successfully proxied DELETE request to the realtime server');
          res.status(200).json(_res.body);
        }
      });
    }
    catch (ex) {
      const message = 'An error occurred proxying the DELETE request to the realtime server';
      logger.critical('main', message, ex);
      res.status(500).json(message);
    }
  });
}