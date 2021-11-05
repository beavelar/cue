import express from 'express';
import httpProxy from 'http-proxy';
import bodyParser from 'body-parser';
import { Environment } from './env/env';
import { Logger } from './logging/logger';

const logger = new Logger('server');
const env = new Environment();
if (env.validKeys()) {
  const server = express();
  const proxy = new httpProxy();
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());

  server.post('/historical', (req, res) => {
    logger.log('main', `Receive POST request - ${req.url}`);
    const url = req.url.replace('/historical', '');
    proxy.web(req, res, {
      target: `http://${env.HISTORICAL_SERVER_HOSTNAME}:${env.HISTORICAL_SERVER_PORT}/${url}`
    }, (err, req) => {
      if (err) {
        res.status(500).json('Oh no :(');
      }
      else {
        res.status(200).json('Okay :)');
      }
    });
  });

  server.post('/realtime', (req, res) => {
    logger.log('main', `Receive POST request - ${req.url}`);
    const url = req.url.replace('/realtime', '');
    proxy.web(req, res, {
      target: `http://${env.REALTIME_SERVER_HOSTNAME}:${env.REALTIME_SERVER_PORT}/${url}`
    }, (err, req) => {
      if (err) {
        res.status(500).json('Oh no :(');
      }
      else {
        res.status(200).json('Okay :)');
      }
    });
  });

  server.listen(env.PROXY_PORT, () => {
    logger.log('main', `Server is up and listening on port: ${env.PROXY_PORT}`);
  });
}