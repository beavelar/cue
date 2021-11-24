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
      this.logger.info('main', `Receive GET request`);
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
     * The callback for historical GET requests with a start parameter. Will proxy the request to the
     * historical server as a GET request with the start parameter.
     */
    this.router.get('/:start', (req, res) => {
      this.logger.info('main', `Receive GET request with start: ${req.params.start}`);
      const startSeconds = parseInt(req.params.start);
      if (!isNaN(startSeconds)) {
        const url = `http://${this.env.HISTORICAL_SERVER_HOSTNAME}:${this.env.HISTORICAL_SERVER_PORT}/${startSeconds}`;
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
      }
      else {
        const message = `Invalid start parameter provided: ${req.params.start}`;
        this.logger.warning('main', message);
        res.status(500).json(message);
      }
    });

    /**
     * The callback for historical GET requests with a start and stop parameter. Will proxy the request
     * to the historical server as a GET request with the start and stop parameter.
     */
    this.router.get('/:start/:stop', (req, res) => {
      this.logger.info('main', `Receive GET request with start: ${req.params.start} and stop: ${req.params.stop}`);
      const startSeconds = parseInt(req.params.start);
      const stopSeconds = parseInt(req.params.stop);
      if (!isNaN(startSeconds) && !isNaN(stopSeconds)) {
        const url = `http://${this.env.HISTORICAL_SERVER_HOSTNAME}:${this.env.HISTORICAL_SERVER_PORT}/${startSeconds}/${stopSeconds}`;
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
      }
      else {
        const message = `Invalid start or stop parameter provided: start - ${req.params.start}, stop - ${req.params.stop}`;
        this.logger.warning('main', message);
        res.status(500).json(message);
      }
    });

    /**
     * The callback for historical POST requests. Will proxy the request to the historical server as a
     * POST request.
     */
    this.router.post('/', (req, res) => {
      this.logger.info('main', `Receive POST request`);
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
      this.logger.info('main', `Receive DELETE request`);
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