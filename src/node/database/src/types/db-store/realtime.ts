export interface RealtimeAlert {
  [key: string]: RealtimeContents
}

export interface RealtimeContents {
  alert_date: string,
  ask: number,
  days_to_expiry: number,
  delta: number,
  diff: number,
  expires: string,
  gamma: number,
  implied_volatility: number,
  open_interest: number,
  option_type: string,
  rho: number,
  strike: number,
  theta: number,
  ticker: string,
  time_of_day: string,
  underlying: number,
  vega: number,
  volume: number,
  'vol/oi': number
}

export interface RealtimeContentsRated {
  alert_date: string,
  ask: {
    rate: string,
    value: number
  },
  days_to_expiry: {
    rate: string,
    value: number
  },
  delta: {
    rate: string,
    value: number
  },
  diff: {
    rate: string,
    value: number
  },
  expires: string,
  gamma: {
    rate: string,
    value: number
  },
  implied_volatility: {
    rate: string,
    value: number
  },
  open_interest: {
    rate: string,
    value: number
  },
  option_type: string,
  rho: {
    rate: string,
    value: number
  },
  strike: {
    rate: string,
    value: number
  },
  theta: {
    rate: string,
    value: number
  },
  ticker: string,
  time_of_day: string,
  underlying: {
    rate: string,
    value: number
  },
  vega: {
    rate: string,
    value: number
  },
  volume: {
    rate: string,
    value: number
  },
  'vol/oi': {
    rate: string,
    value: number
  }
}

export function createEmptyRatedAlert(): RealtimeContentsRated {
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