/**
 * Interface which will encapsulate the incoming realtime alerts.
 */
export interface RealtimeAlerts {
  [key: string]: RealtimeAlert
}

/**
 * Interface which will encapsulate the incoming realtime alert.
 */
export interface RealtimeAlert {
  /** The date the alert was raised. Ex. 2000-01-01T00:00:00Z. */
  alert_date: string;
  /** The ask price of the option at the time of the alert. */
  ask: number;
  /** The number of days between the alert date and the expiry date. */
  days_to_expiry: number;
  /** The option delta value. */
  delta: number;
  /** The difference between the strike price and the underlying value. */
  diff: number;
  /** The expiry date of the option. Ex. 2000-01-01. */
  expires: string;
  /** The option gamma value. */
  gamma: number;
  /** The option implied volatility value. */
  implied_volatility: number;
  /** The option open interest value. */
  open_interest: number;
  /** The option type (Call/Put). */
  option_type: string;
  /** The option rho value. */
  rho: number;
  /** The strike price of the option. */
  strike: number;
  /** The option theta value. */
  theta: number;
  /** The ticker of the option. */
  ticker: string;
  /** The time of day that the alert was raised. Ex. 00:00:00. */
  time_of_day: string;
  /** The underlying value at the time the alert was raised. */
  underlying: number;
  /** The option vega value. */
  vega: number;
  /** The volume of the option at the time the alert was raised. */
  volume: number;
  /** The calculation of volume/open interest. */
  'vol/oi': number
}

/**
 * Interface which will encapsulate the rated realtime alert which will be
 * saved onto the database.
 */
export interface RatedRealtimeAlert {
  /** The date the alert was raised. Ex. 2000-01-01T00:00:00Z. */
  alert_date: string;
  /** The ask price of the option at the time of the alert and the rating. */
  ask: {
    rate: string,
    value: number
  };
  /** The number of days between the alert date and the expiry date and the rating. */
  days_to_expiry: {
    rate: string,
    value: number
  };
  /** The option delta value and the rating. */
  delta: {
    rate: string,
    value: number
  };
  /** The difference between the strike price and the underlying value and the rating. */
  diff: {
    rate: string,
    value: number
  };
  /** The expiry date of the option. Ex. 2000-01-01. */
  expires: string;
  /** The option gamma value and the rating. */
  gamma: {
    rate: string,
    value: number
  };
  /** The option implied volatility value and the rating. */
  implied_volatility: {
    rate: string,
    value: number
  };
  /** The option open interest value and the rating. */
  open_interest: {
    rate: string,
    value: number
  };
  /** The option type (Call/Put). */
  option_type: string;
  /** The option rho value and the rating. */
  rho: {
    rate: string,
    value: number
  };
  /** The strike price of the option and the rating. */
  strike: {
    rate: string,
    value: number
  };
  /** The option theta value and the rating. */
  theta: {
    rate: string,
    value: number
  };
  /** The ticker of the option. */
  ticker: string;
  /** The time of day that the alert was raised. Ex. 00:00:00. */
  time_of_day: string;
  /** The underlying value at the time the alert was raised and the rating. */
  underlying: {
    rate: string,
    value: number
  };
  /** The option vega value and the rating. */
  vega: {
    rate: string,
    value: number
  };
  /** The volume of the option at the time the alert was raised and the rating. */
  volume: {
    rate: string,
    value: number
  };
  /** The calculation of volume/open interest and the rating. */
  'vol/oi': {
    rate: string,
    value: number
  }
}

/**
 * Helper function to create and emtpy RatedRealtimeAlert instance.
 * 
 * @returns Empty RatedRealtimeAlert instance.
 */
export function createEmptyRatedAlert(): RatedRealtimeAlert {
  return {
    alert_date: '',
    ask: {
      rate: '',
      value: 0
    },
    days_to_expiry: {
      rate: '',
      value: 0
    },
    delta: {
      rate: '',
      value: 0
    },
    diff: {
      rate: '',
      value: 0
    },
    expires: '',
    gamma: {
      rate: '',
      value: 0
    },
    implied_volatility: {
      rate: '',
      value: 0
    },
    open_interest: {
      rate: '',
      value: 0
    },
    option_type: '',
    rho: {
      rate: '',
      value: 0
    },
    strike: {
      rate: '',
      value: 0
    },
    theta: {
      rate: '',
      value: 0
    },
    ticker: '',
    time_of_day: '',
    underlying: {
      rate: '',
      value: 0
    },
    vega: {
      rate: '',
      value: 0
    },
    volume: {
      rate: '',
      value: 0
    },
    'vol/oi': {
      rate: '',
      value: 0
    }
  }
}