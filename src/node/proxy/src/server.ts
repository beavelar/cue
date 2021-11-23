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
    needle.post(url, req.body, { json: true }, (err, _res) => {
      if (err) {
        logger.critical('main', 'An error occurred with the /historical request', err);
        res.status(500).json(err);
      }
      else {
        logger.info('main', 'Successfully executed /historical request');
        res.status(200).json(_res.body);
      }
    });
  });

  server.post('/realtime', (req, res) => {
    logger.info('main', `Receive POST request - ${req.url}`);
    const url = `http://${env.REALTIME_SERVER_HOSTNAME}:${env.REALTIME_SERVER_PORT}/`;
    needle.post(url, req.body, { json: true }, (err, _res) => {
      if (err) {
        logger.critical('main', 'An error occurred with the /realtime request', err);
        res.status(500).json(err);
      }
      else {
        logger.info('main', 'Successfully executed /realtime request');
        res.status(200).json(_res.body);
      }
    });
  });

  server.listen(env.PROXY_PORT, () => {
    logger.info('main', `Server is up and listening on port: ${env.PROXY_PORT}`);
  });
}