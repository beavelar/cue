import { Logger } from '../util/logging/logger';
import { Document, Schema, model, connect } from 'mongoose';
import { HistoricalAlert, HistoricalAlerts } from '../types/db-store/historical';
import { createEmptyRatedAlert, RealtimeAlert, RatedRealtimeAlert } from '../types/db-store/realtime';

/**
 * The interface which will be responsible for the database read/writes. Users must
 * first call the connect method before attempting to use the rest of the interface.
 * Attempting to use the rest of the interface before connecting will yield no results.
 */
export class DBStore {
  /** Logger for DBStore */
  private readonly logger = new Logger('DBStore');

  /** Schema structure for realtime data points */
  private realtimeSchema = new Schema<RatedRealtimeAlert>({
    alert_date: { type: Number, required: true },
    ask: { type: { rate: String, value: Number }, required: true },
    days_to_expiry: { type: { rate: String, value: Number }, required: true },
    delta: { type: { rate: String, value: Number }, required: true },
    diff: { type: { rate: String, value: Number }, required: true },
    expires: { type: Number, required: true },
    gamma: { type: { rate: String, value: Number }, required: true },
    implied_volatility: { type: { rate: String, value: Number }, required: true },
    open_interest: { type: { rate: String, value: Number }, required: true },
    option_type: { type: String, required: true },
    rho: { type: { rate: String, value: Number }, required: true },
    strike: { type: { rate: String, value: Number }, required: true },
    theta: { type: { rate: String, value: Number }, required: true },
    ticker: { type: String, required: true },
    time_of_day: { type: { rate: String, value: Number }, required: true },
    underlying: { type: { rate: String, value: Number }, required: true },
    vega: { type: { rate: String, value: Number }, required: true },
    volume: { type: { rate: String, value: Number }, required: true },
    'vol/oi': { type: { rate: String, value: Number }, required: true }
  }, { collection: 'realtime' });

  /** Schema structure for historical data points */
  private historicalSchema = new Schema<HistoricalAlert>({
    alert_date: { type: Number, required: true },
    ask: { type: Number, required: true },
    days_to_expiry: { type: Number, required: true },
    delta: { type: Number, required: true },
    diff: { type: Number, required: true },
    expires: { type: Number, required: true },
    gamma: { type: Number, required: true },
    highest_ask: { type: Number, required: true },
    implied_volatility: { type: Number, required: true },
    open_interest: { type: Number, required: true },
    option_type: { type: String, required: true },
    'p/l': { type: Number, required: true },
    rate: { type: String, required: true },
    rho: { type: Number, required: true },
    strike: { type: Number, required: true },
    theta: { type: Number, required: true },
    ticker: { type: String, required: true },
    time_of_day: { type: Number, required: true },
    time_passed: { type: Number, required: true },
    underlying: { type: Number, required: true },
    vega: { type: Number, required: true },
    volume: { type: Number, required: true },
    'vol/oi': { type: Number, required: true }
  }, { collection: 'historical' });

  /** MongoDB model for realtime data points */
  private RealtimeModel = model<RatedRealtimeAlert>('realtime', this.realtimeSchema);

  /** MongoDB model for realtime data points */
  private HistoricalModel = model<HistoricalAlert>('historical', this.historicalSchema);

  /** Keys that shouldn't be rated as they can't be compared */
  private unratedKeys: Array<string> = new Array<string>();

  constructor() {
    this.unratedKeys.push('alert_date');
    this.unratedKeys.push('expires');
    this.unratedKeys.push('option_type');
    this.unratedKeys.push('ticker');
  }

  /**
   * Method to return the Promise created by the mongoose 'connect' method. If connection
   * to the database is succesful, the promise will resolve, if the connection is unsuccessful,
   * the promise will reject. This method must executed first before attempting to use the rest
   * of the interface.
   * 
   * @param url String containing the database url
   * @returns The Promise created from the mongoose 'connect' method
   */
  public async connect(url: string): Promise<typeof import('mongoose')> {
    return connect(url);
  }

  /**
   * Method to retrieve the Mongo "find" promise based on the parameters provided for the
   * realtime collection. Sorts data by alert_date if no sort is provided.
   * 
   * @param filter The "filter" (Projection in Mongo terms) that controls what's emitted and
   *               omitted in the Mongo response 
   * @param sort The "sort" that controls how the document is sorted
   * @returns A promise which will resolve to a array of RatedRealtimeAlert
   */
  public async getAllRealtime(filter?: any, sort?: any): Promise<Array<RatedRealtimeAlert>> {
    if (filter && sort) {
      return this.RealtimeModel.find({}, filter).sort(sort);
    }
    else if (filter) {
      return this.RealtimeModel.find({}, filter).sort({ "alert_date": 1 });
    }
    else {
      return this.RealtimeModel.find().sort({ "alert_date": 1 });
    }
  }

  /**
   * Method to retrieve the Mongo "find" promise based on the start and option stop parameters.
   * Method is to be utilized when creating a more narrow request instead of request all realtime
   * data. The data will be narrowed based on the alert date. Sorts data by alert_date.
   * 
   * @param start The start date of the realtime data request
   * @param stop The stop date of the realtime data request
   * @returns A promise which will resolve to a array of RatedRealtimeAlert
   */
  public async getRealtime(start: number, stop?: number): Promise<Array<RatedRealtimeAlert>> {
    if (stop) {
      return this.RealtimeModel.find({ "alert_date": { "$gte": start, "$lte": stop } }).sort({ "alert_date": 1 });
    }
    else {
      return this.RealtimeModel.find({ "alert_date": { "$gte": start } }).sort({ "alert_date": 1 });
    }
  }

  /**
   * Will write the incoming realtime alerts with a rating on select fields onto the Mongo
   * database.
   * 
   * @param realtime The incoming realtime alerts
   * @returns A promise which will resolve to a string containing the result of the
   *          operation
   */
  public async writeRealtime(realtime: RealtimeAlert): Promise<string> {
    this.logger.info('writeRealtime', 'Received realtime write request');
    const promise = new Promise<string>((resolve, reject) => {
      const ratedAlerts = new Array<RatedRealtimeAlert>();

      this.logger.info('writeRealtime', 'Requesting historical data from the historical collection');
      this.getAllHistorical().then((data) => {
        const sortedHistoricalAlerts = {};

        // Sorts the receiving historical data for easier comparisons
        this.logger.info('writeRealtime', 'Sorting received historical data');
        for (const key of Object.keys(Object.values(realtime)[0])) {
          if (!this.unratedKeys.includes(key)) {
            sortedHistoricalAlerts[key] = data.map((item) => {
              return {
                rate: item.rate,
                value: item[key]
              };
            }).sort((left, right) => { return left.value - right.value });
          }
        }

        // Rates the incoming realtime data by comparing values to sorted historical data
        this.logger.info('writeRealtime', 'Rating incoming realtime data');
        for (const alert of Object.values(realtime)) {
          const ratedAlert = createEmptyRatedAlert();
          ratedAlert.alert_date = alert.alert_date;
          ratedAlert.expires = alert.expires;
          ratedAlert.option_type = alert.option_type;
          ratedAlert.ticker = alert.ticker;

          // Loops through each key. Ex. alert_date, ask, days_to_expiry, etc.
          for (const key of Object.keys(alert)) {
            // Only process comparable keys. View constructore for list of keys to be ignored
            if (!this.unratedKeys.includes(key)) {
              // Loops through the sorted data to find 2 points that the incoming data resides in
              // Checks which point the incoming point is closer to and utilizes the rate of that point
              for (let index = 0; index < sortedHistoricalAlerts[key].length - 1; index++) {
                // Only process if incoming point is inbetween the 2 points
                if (alert[key] >= sortedHistoricalAlerts[key][index].value && alert[key] <= sortedHistoricalAlerts[key][index + 1].value) {
                  const leftDiff = sortedHistoricalAlerts[key][index].value - alert[key];
                  const rightDiff = alert[key] - sortedHistoricalAlerts[key][index + 1].value;

                  if (leftDiff <= rightDiff) {
                    // The incoming point is closer to the left point
                    ratedAlert[key] = {
                      rate: sortedHistoricalAlerts[key][index].rate,
                      value: alert[key]
                    };
                    break;
                  }
                  else {
                    // The incoming point is closer to the right point
                    ratedAlert[key] = {
                      rate: sortedHistoricalAlerts[key][index + 1].rate,
                      value: alert[key]
                    };
                    break;
                  }
                }
              }
            }
          }
          ratedAlerts.push(ratedAlert);
        }

        // Writes the rated realtime data onto the realtime collection. Result of the operation will be
        // flowed back to the executor of the method
        this.logger.info('writeRealtime', 'Writing rated realtime data onto realtime collection');
        this.RealtimeModel.insertMany(ratedAlerts).then((onfulfilled) => {
          this.logger.info('writeRealtime', 'Successfully saved rated realtime alerts onto realtime collection');
          resolve('Realtime alerts written');
        }).catch((onrejected) => {
          this.logger.info('writeRealtime', `Failed to write realtime data to database: ${onrejected}`);
          reject(`Failed to write realtime data to database: ${onrejected}`);
        });
      }).catch((err) => {
        this.logger.critical('writeRealtime', 'An error occurred attempting to retrieve historical data from the database', err);
        reject(`An error occurred attempting to retrieve historical data from the database: ${err}`);
      });
    });
    return promise;
  }

  /**
   * Method to retrieve the Mongo "remove" promise. No options will be provided to "remove"
   * to remove all realtime data.
   * 
   * @returns A promise which will resolve to a Mongo Document
   */
  public async deleteAllRealtime(): Promise<this> {
    return this.RealtimeModel.remove({});
  }

  /**
   * Method to retrieve the Mongo "find" promise based on the parameters provided for the
   * historical collection. Sorts data by alert_date if no sort is provided.
   * 
   * @param filter The "filter" (Projection in Mongo terms) that controls what's emitted and
   *               omitted in the Mongo response 
   * @param sort The "sort" that controls how the document is sorted
   * @returns A promise which will resolve to a array of HistoricalAlert
   */
  public async getAllHistorical(filter?: any, sort?: any): Promise<Array<HistoricalAlert>> {
    if (filter && sort) {
      return this.HistoricalModel.find({}, filter).sort(sort);
    }
    else if (filter) {
      return this.HistoricalModel.find({}, filter).sort({ "alert_date": 1 });
    }
    else {
      return this.HistoricalModel.find().sort({ "alert_date": 1 });
    }
  }

  /**
   * Method to retrieve the Mongo "find" promise based on the start and option stop parameters.
   * Method is to be utilized when creating a more narrow request instead of request all historical
   * data. The data will be narrowed based on the alert date. Sorts data by alert_date.
   * 
   * @param start The start date of the historical data request
   * @param stop The stop date of the historical data request
   * @returns A promise which will resolve to a array of HistoricalAlert
   */
  public async getHistorical(start: number, stop?: number): Promise<Array<HistoricalAlert>> {
    if (stop) {
      return this.HistoricalModel.find({ "alert_date": { "$gte": start, "$lte": stop } }).sort({ "alert_date": 1 });
    }
    else {
      return this.HistoricalModel.find({ "alert_date": { "$gte": start } }).sort({ "alert_date": 1 });
    }
  }

  /**
   * Will write the incoming historical alerts onto the Mongo database.
   * 
   * @param historical The incoming historical alerts
   * @returns A promise which will resolve to a string containing the result of the
   *          operation
   */
  public async writeHistorical(historical: HistoricalAlerts): Promise<string> {
    this.logger.info('writeHistorical', 'Received historical write request');
    const promise = new Promise<string>((resolve, reject) => {
      this.HistoricalModel.insertMany(Object.values(historical)).then((onfulfilled) => {
        this.logger.info('writeHistorical', 'Successfully saved historical alerts onto historical collection');
        resolve('Historical alerts written');
      }).catch((onrejected) => {
        this.logger.info('writeHistorical', `Failed to write historical data to database: ${onrejected}`);
        reject(`Failed to write historical data to database: ${onrejected}`);
      });
    });
    return promise;
  }

  /**
   * Method to retrieve the Mongo "remove" promise. No options will be provided to "remove"
   * to remove all historical data.
   * 
   * @returns A promise which will resolve to a Mongo Document
   */
  public async deleteAllHistorical(): Promise<Document> {
    return this.HistoricalModel.remove({});
  }
}