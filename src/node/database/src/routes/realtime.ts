import express from 'express';
import { DBStore } from 'src/store/db-store';
import { Logger } from '../util/logging/logger';

export class Realtime {
  /** The express router to utilize for the routes */
  public router: express.Router = express.Router();

  constructor(private readonly logger: Logger, private readonly store: DBStore) {
    /**
     * The callback for DB-Store realtime GET request. Will create a request to get the data in the
     * realtime collection in the database.
     */
    this.router.get('/', (req, res) => {
      this.logger.info('main', `Receive GET request`);
      this.store.getAllRealtime().then((data) => {
        this.logger.info('main', 'Successfully retrieved realtime data from the database');
        res.status(200).json(data);
      }).catch((err) => {
        this.logger.critical('main', 'An error occurred retrieving realtime data from the database', err);
        res.status(500).json(err);
      });
    });

    /**
     * The callback for DB-Store realtime GET request with a start parameter. Will create a request to get the
     * data in the realtime collection in the database.
     */
    this.router.get('/:start', (req, res) => {
      this.logger.info('main', `Receive GET request with start: ${req.params.start}`);
      const startSeconds = parseInt(req.params.start);
      if (!isNaN(startSeconds)) {
        this.store.getRealtime(startSeconds).then((data) => {
          this.logger.info('main', 'Successfully retrieved realtime data from the database');
          res.status(200).json(data);
        }).catch((err) => {
          this.logger.critical('main', 'An error occurred retrieving realtime data from the database', err);
          res.status(500).json(err);
        });
      }
      else {
        const message = `Invalid start parameter provided: ${req.params.start}`;
        this.logger.warning('main', message);
        res.status(500).json(message);
      }
    });

    /**
     * The callback for DB-Store realtime GET request with a start and stop parameter. Will create a request to
     * get the data in the realtime collection in the database.
     */
    this.router.get('/:start/:stop', (req, res) => {
      this.logger.info('main', `Receive GET request with start: ${req.params.start} and stop: ${req.params.stop}`);
      const startSeconds = parseInt(req.params.start);
      const stopSeconds = parseInt(req.params.stop);
      if (!isNaN(startSeconds) && !isNaN(stopSeconds)) {
        this.store.getRealtime(startSeconds, stopSeconds).then((data) => {
          this.logger.info('main', 'Successfully retrieved realtime data from the database');
          res.status(200).json(data);
        }).catch((err) => {
          this.logger.critical('main', 'An error occurred retrieving realtime data from the database', err);
          res.status(500).json(err);
        });
      }
      else {
        const message = `Invalid start or stop parameter provided: start - ${req.params.start}, stop - ${req.params.stop}`;
        this.logger.warning('main', message);
        res.status(500).json(message);
      }
    });

    /**
     * The callback for DB-Store realtime POST request. Will create a request to write the incoming data to
     * the realtime collection in the database.
     */
    this.router.post('/', (req, res) => {
      this.logger.info('main', `Receive POST request - ${req.url}`);
      this.store.writeRealtime(req.body).then((result) => {
        this.logger.info('main', 'Successfully rated and wrote realtime data to the database');
        res.status(200).json(result);
      }).catch((err) => {
        this.logger.critical('main', 'An error occurred rating and/or writing realtime data to the database', err);
        res.status(500).json(err);
      });
    });

    /**
     * The callback for DB-Store realtime DELETE request. Will create a request to delete the data in the
     * realtime collection in the database.
     */
    this.router.delete('/', (req, res) => {
      this.logger.info('main', `Receive DELETE request - ${req.url}`);
      this.store.deleteAllRealtime().then((result) => {
        this.logger.info('main', 'Successfully deleted realtime data from the database');
        res.status(200).json(result);
      }).catch((err) => {
        this.logger.critical('main', 'An error occurred deleting realtime data from the database', err);
        res.status(500).json(err);
      });
    });
  }
}