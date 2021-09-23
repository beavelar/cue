import logging
import numpy as np
import pandas as pd
from numpy import ndarray
from datetime import datetime
from pandas.core.frame import DataFrame

#########################################################################################################
# Logger definition

logging.basicConfig(format='%(levelname)s: %(asctime)s - %(name)s.%(funcName)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

#########################################################################################################

def parse_dataframe(input: DataFrame) -> DataFrame:
	'''
	append_dataframe
	----------

	This function will append input DataFrame with output DataFrame
	
	The result of the appending will be returned
	'''
	logger.info('Retrieving numpy arrays from dataframe')
	ticker_np = input.ticker_symbol.to_numpy()
	option_type_np = input.option_type.to_numpy()
	alerted_at_np = input.alert_time.to_numpy()
	input_day_np, input_time_np = extract_date_time(input.alert_time.to_numpy())
	day_of_week_np = input_day_np
	time_of_day_np = input_time_np
	temp_expiry_np = expiry_to_string(input.expires_at.to_numpy())
	expiry_np = temp_expiry_np
	days_to_exp_np = days_to_expiry(alerted_at_np, expiry_np)
	strike_np = input.strike_price.to_numpy()
	underlying_np = input.underlying_purchase_price.to_numpy()
	diff_np = (input['diff'].to_numpy()/100)
	volume_np = input.volume.to_numpy()
	open_interest_np = input.open_interest.to_numpy()
	vol_oi_np = volume_np/open_interest_np
	implied_vol_np = input.implied_volatility.to_numpy()
	delta_np = input.delta.to_numpy()
	gamma_np = input.gamma.to_numpy()
	vega_np = input.vega.to_numpy()
	theta_np = input.theta.to_numpy()
	rho_np = input.rho.to_numpy()
	alert_ask_np = input.ask.to_numpy()
	input_high_ask_np, input_p_l_np, input_time_passed_np = determine_win_loss(input.high.to_numpy(),
		input.high_date_time.to_numpy(), input.low.to_numpy(), input.low_date_time.to_numpy(),
		input.ask.to_numpy(), input.alert_time.to_numpy())
	high_ask_np = input_high_ask_np
	p_l_np = input_p_l_np
	time_passed_np = input_time_passed_np

	output_data = np.array([ticker_np, option_type_np, alerted_at_np, day_of_week_np,
		time_of_day_np, expiry_np, days_to_exp_np, strike_np, underlying_np, diff_np,
		volume_np, open_interest_np, vol_oi_np, implied_vol_np, delta_np, gamma_np,
		vega_np, theta_np, rho_np, alert_ask_np, high_ask_np, p_l_np, time_passed_np])

	df_columns = np.array(['Ticker', 'Option Type', 'Alerted At', 'Day of Week', 'Time of Day', 'Expiry',
		'Days to Exp.', 'Strike', 'Underlying', 'Diff %', 'Volume', 'Open Interest', 'Vol/OI',
		'Implied Volatility', 'Delta', 'Gamma', 'Vega', 'Theta', 'Rho', 'Alert Ask', 'Highest Ask', 'P/L',
		'Time Passed'])
	output_df = pd.DataFrame(data=output_data.T, columns=df_columns)
	logger.info('Dataframe created from extracted data from incoming dataframe')
	return output_df

#########################################################################################################

def append_dataframe(input: DataFrame, output: DataFrame) -> DataFrame:
	'''
	append_dataframe
	----------

	This function will append input DataFrame with output DataFrame
	
	The result of the appending will be returned
	'''
	logger.info('Retrieving numpy arrays to append to output dataframe')
	ticker_np = np.append(output.Ticker.to_numpy(), input.ticker_symbol.to_numpy())
	option_type_np = np.append(output['Option Type'].to_numpy(), input.option_type.to_numpy())
	alerted_at_np = np.append(output['Alerted At'].to_numpy(), input.alert_time.to_numpy())
	input_day_np, input_time_np = extract_date_time(input.alert_time.to_numpy())
	day_of_week_np = np.append(output['Day of Week'].to_numpy(), input_day_np)
	time_of_day_np = np.append(output['Time of Day'].to_numpy(), input_time_np)
	temp_expiry_np = expiry_to_string(input.expires_at.to_numpy())
	expiry_np = np.append(output.Expiry.to_numpy(), temp_expiry_np)
	days_to_exp_np = days_to_expiry(alerted_at_np, expiry_np)
	strike_np = np.append(output.Strike.to_numpy(), input.strike_price.to_numpy())
	underlying_np = np.append(output.Underlying.to_numpy(), input.underlying_purchase_price.to_numpy())
	diff_np = (np.append(output['Diff %'].to_numpy(), input['diff'].to_numpy()/100))
	volume_np = np.append(output.Volume.to_numpy(), input.volume.to_numpy())
	open_interest_np = np.append(output['Open Interest'].to_numpy(), input.open_interest.to_numpy())
	vol_oi_np = volume_np/open_interest_np
	implied_vol_np = np.append(output['Implied Volatility'].to_numpy(), input.implied_volatility.to_numpy())
	delta_np = np.append(output.Delta.to_numpy(), input.delta.to_numpy())
	gamma_np = np.append(output.Gamma.to_numpy(), input.gamma.to_numpy())
	vega_np = np.append(output.Vega.to_numpy(), input.vega.to_numpy())
	theta_np = np.append(output.Theta.to_numpy(), input.theta.to_numpy())
	rho_np = np.append(output.Rho.to_numpy(), input.rho.to_numpy())
	alert_ask_np = np.append(output['Alert Ask'].to_numpy(), input.ask.to_numpy())
	input_high_ask_np, input_p_l_np, input_time_passed_np = determine_win_loss(input.high.to_numpy(),
		input.high_date_time.to_numpy(), input.low.to_numpy(), input.low_date_time.to_numpy(),
		input.ask.to_numpy(), input.alert_time.to_numpy())
	high_ask_np = np.append(output['Highest Ask'].to_numpy(), input_high_ask_np)
	p_l_np = np.append(output['P/L'].to_numpy(), input_p_l_np)
	time_passed_np = np.append(output['Time Passed'].to_numpy(), input_time_passed_np)

	output_data = np.array([ticker_np, option_type_np, alerted_at_np, day_of_week_np,
		time_of_day_np, expiry_np, days_to_exp_np, strike_np, underlying_np, diff_np,
		volume_np, open_interest_np, vol_oi_np, implied_vol_np, delta_np, gamma_np,
		vega_np, theta_np, rho_np, alert_ask_np, high_ask_np, p_l_np, time_passed_np])

	output_df = pd.DataFrame(data=output_data.T, columns=output.columns.values)
	logger.info('Dataframe appended')
	return output_df

#########################################################################################################

def days_to_expiry(alerts: ndarray, expiries: ndarray) -> ndarray:
	'''
	days_to_expiry
	----------

	This function will loop through the alerts and expiries and check
	
	how many days are between the alert date and the expiry date	
	'''
	logger.info('Calculating the amount of days until the expiry for the array')
	result = []
	for index in range(alerts.size):
		alert_date = None
		if 'T' in alerts[index].split(' ')[0]:
			alert_date = datetime.fromisoformat(alerts[index].split('T')[0])
		else:
			alert_date = datetime.fromisoformat(alerts[index].split(' ')[0])
		expiry_date = datetime.fromisoformat(expiries[index])
		diff = expiry_date - alert_date
		result.append(diff.days)
	return np.array(result)

#########################################################################################################

def expiry_to_string(data: ndarray) -> ndarray:
	'''
	expiry_to_string
	----------

	This function will loop through the provided nparray and turn the expiry into a consumable string	
	'''
	logger.info('Converting the expiry array to a list of strings')
	result = []
	for date_time in data:
		result.append(str(date_time)[0:10])
	return np.array(result)

#########################################################################################################

def extract_date_time(alerts: ndarray): # -> tuple[ndarray, ndarray]:
	'''
	extract_date_time
	----------

	This function will loop through the provided nparray and turn the expiry into a consumable string	
	'''
	logger.info('Extracting the date-time from the array')
	date_result = []
	time_result = []
	week_days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
	for alert in alerts:
		alert_date = None
		alert_time = None
		if 'T' in alert.split(' ')[0]:
			alert_date = datetime.fromisoformat(alert.split('T')[0])
			alert_time_str = alert.split('T')[1]
			alert_time = alert_time_str[0:len(alert_time_str) - 1]
		else:
			alert_date = datetime.fromisoformat(alert.split(' ')[0])
			alert_time_str = alert.split(' ')[1]
			alert_time = alert_time_str[0:len(alert_time_str) - 1]
		date_result.append(week_days[alert_date.weekday()])
		time_result.append(alert_time)
	return np.array(date_result), np.array(time_result)

#########################################################################################################

def determine_win_loss(highs: ndarray, high_dates: ndarray, lows: ndarray, low_dates: ndarray,
	asks: ndarray, alert_dates: ndarray) -> ndarray:
	'''
	determine_win_loss
	----------

	This function will compare the elements and return the highest ask, the P/L, and the time passed
	'''
	logger.info('Determining win/loss and utilizing the corresponding high/low')
	high_ask_result = []
	p_l_result = []
	time_passed_result = []
	for index in range(highs.size):
		alert_date_str = alert_dates[index][0:len(alert_dates[index]) - 1]
		high_date_str = high_dates[index][0:len(high_dates[index]) - 1]
		low_date_str = low_dates[index][0:len(low_dates[index]) - 1]
		
		alert_dt = datetime.fromisoformat(alert_date_str)
		high_dt = datetime.fromisoformat(high_date_str)
		low_dt = datetime.fromisoformat(low_date_str)
		diff = high_dt - low_dt

		loss_p_l = (lows[index]/asks[index])-1
		win_p_l = (highs[index]-asks[index])/asks[index]
		if diff.days > 0 and loss_p_l < -.25:
			alert_diff = low_dt - alert_dt

			high_ask_result.append(lows[index])
			p_l_result.append(loss_p_l)
			# Store hh:mm:ss instead of # of days
			# time_passed_result.append(alert_diff)
			time_passed_result.append(alert_diff.days)
		else:
			alert_diff = high_dt - alert_dt

			high_ask_result.append(highs[index])
			p_l_result.append(win_p_l)
			# Store hh:mm:ss instead of # of days
			# time_passed_result.append(alert_diff.days)
			time_passed_result.append(alert_diff.days)
	return np.array(high_ask_result), np.array(p_l_result), np.array(time_passed_result)