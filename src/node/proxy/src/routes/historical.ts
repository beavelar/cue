import needle from 'needle';
import express from 'express';
import { Environment } from 'src/util/env/env';
import { Logger } from "../util/logging/logger";

export class Historical {
  /** The express router to utilize for the routes */
  public router: express.Router = express.Router();

  constructor(private readonly env: Environment, private readonly logger: Logger) {
    /**
     * The callback for historical GET requests. Will proxy the request to the historical server as a
     * GET request.
     */
    this.router.get('/', (req, res) => {
      this.logger.info('main', `Receive GET request - ${req.url}`);
      const url = `http://${this.env.HISTORICAL_SERVER_HOSTNAME}:${this.env.HISTORICAL_SERVER_PORT}/`;

      try {
        needle.get(url, (err, _res) => {
          if (err) {
            const message = 'An error occurred proxying the GET request to the historical server';
            this.logger.critical('main', message, err);
            res.status(500).json(message);
          }
          else {
            this.logger.info('main', 'Successfully proxied GET request to the historical server');
            res.status(200).json(_res.body);
          }
        });
      }
      catch (ex) {
        const message = 'An error occurred proxying the GET request to the historical server';
        this.logger.critical('main', message, ex);
        res.status(500).json(message);
      }
    });

    /**
     * The callback for historical POST requests. Will proxy the request to the historical server as a
     * POST request.
     */
    this.router.post('/', (req, res) => {
      this.logger.info('main', `Receive POST request - ${req.url}`);
      const url = `http://${this.env.HISTORICAL_SERVER_HOSTNAME}:${this.env.HISTORICAL_SERVER_PORT}/`;

      try {
        needle.post(url, req.body, { json: true }, (err, _res) => {
          if (err) {
            const message = 'An error occurred proxying the POST request to the historical server';
            this.logger.critical('main', message, err);
            res.status(500).json(message);
          }
          else {
            this.logger.info('main', 'Successfully proxied POST request to the historical server');
            res.status(200).json(_res.body);
          }
        });
      }
      catch (ex) {
        const message = 'An error occurred proxying the POST request to the historical server';
        this.logger.critical('main', message, ex);
        res.status(500).json(message);
      }
    });

    /**
     * The callback for historical POST requests. Will proxy the request to the historical server as a
     * POST request.
     */
    this.router.delete('/', (req, res) => {
      this.logger.info('main', `Receive DELETE request - ${req.url}`);
      const url = `http://${this.env.HISTORICAL_SERVER_HOSTNAME}:${this.env.HISTORICAL_SERVER_PORT}/`;

      try {
        needle.delete(url, {}, (err, _res) => {
          if (err) {
            const message = 'An error occurred proxying the DELETE request to the historical server';
            this.logger.critical('main', message, err);
            res.status(500).json(message);
          }
          else {
            this.logger.info('main', 'Successfully proxied DELETE request to the historical server');
            res.status(200).json(_res.body);
          }
        });
      }
      catch (ex) {
        const message = 'An error occurred proxying the DELETE request to the historical server';
        this.logger.critical('main', message, ex);
        res.status(500).json(message);
      }
    });
  }
}