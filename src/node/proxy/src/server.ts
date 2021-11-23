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
}